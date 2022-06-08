require('dotenv').config();
const express = require('express');
var MessageModel = require('../models/message')
var ThreadModel = require('../models/thread')
var _ = require('lodash');
var sendNotification = require('../helpers/sendNotification')
var router = express.Router();


router.post('/write', (req, res) => {
  
    const data = req.body;
    ThreadModel.findOneAndUpdate(
      { 
        $or: 
        [
          {
            $and:[ {'member1Id':data.member1Id},{'member2Id':data.member2Id}] 
          },
          {
            $and:[ {'member1Id':data.member2Id},{'member2Id':data.member1Id}] 
          },
        ]
      },
      {
        ...data,
        timestamp: new Date()
      },
      {
        new: true,
        upsert:true
      }
      )
      .exec()
      .then(result=>{
        const msg = {
          threadId: result._id,
          senderId: data.member1Id,
          message: data.lastMessage,
          timestamp: new Date()
        }
        MessageModel.create(msg, function (err, small) {
          if (err) res.status(500).send(err);
          var io = req.app.get('socketio');
          io.emit('FromAPI');
          const payload = {
            contents: {"en": data.lastMessage},
            headings: {"en": data.member2Name},
            ios_badgeType: "Increase",
            ios_badgeCount: 1
          }
          sendNotification(data.member2Id,payload)
         // res.status(200).send(msg)
        });
      
      })
      .catch(err=> res.status(500).send(err));
});
  
router.get('/inbox/:userId', (req, res) => {
  const userId = req.params.userId;
  ThreadModel.find(
    {   
          $or:[ {'member1Id':userId},{'member2Id':userId}] 
    },
    )
    .exec()
    .then(result=>{
      
        res.status(200).send(result)
    
    })
    .catch(err=> res.status(500).send(err));

});

router.get('/thread/:threadId', (req, res) => {
  const threadId = req.params.threadId;
  MessageModel.find({threadId})
    .sort({timestamp:'desc'})
    .exec()
    .then(result=>{
      
        res.status(200).send(result)
    
    })
    .catch(err=> res.status(500).send(err));

});

  
  module.exports = router;