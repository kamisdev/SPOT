require('dotenv').config();
const express = require('express');
var DeviceModel = require('../models/device')
var router = express.Router();
var apn = require('apn')
var apnProvider = require('../apn/apnprovider')
var _ = require('lodash');
var axios = require('axios');
var sendNotification = require('../helpers/sendNotification')

router.post('/add', (req, res) => {
  console.log('here')
  const data = req.body;
  console.log(data)
  if (data.deviceId){
    DeviceModel.findOneAndUpdate(
      {
       
          deviceId:data.deviceId 
      },
      {
        deviceId:data.deviceId,
        userId:data.userId
      },
      {
        new: true,
        upsert:true
      }
      )
      .exec()
      .then(result=>{
        console.log(result);
        res.status(200).send(result)
      })
      .catch(err=> res.status(500).send(err));
  } else {
    res.status(500).send('no device token');
  }      
    
});


router.post('/send', function (req, res, next) {


    const {userId,body} = req.body;
    console.log(userId,body)
    sendNotification(userId,body).then((result)=>{
      res.send(result);
    }).catch(err=>console.log(err))
   
});
module.exports = router;