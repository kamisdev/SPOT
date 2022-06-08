require('dotenv').config();
const express = require('express');
var PhotoModel = require('../models/photo')
var router = express.Router();

router.post('/upload', (req, res) => {
    const data = req.body;
    console.log(data);
    if (!data.picture||data.picture!==''){
      PhotoModel.create({
        ...data,
      }, function (err, small) {
        if (err) res.status(500).send(err);
        res.status(200).send('Successfully added photo.')
      });
    } else {
      res.status(500).send('Invalid photo');
    }
    
  });
  
  router.get('/u/:userId', function (req, res) {
    PhotoModel.find({userId:req.params.userId }).exec().then(result=>{
        res.status(200).send(result)
      }).catch(err=> res.status(500).send(err));
  })

  router.get('/p/:petId', function (req, res) {
    PhotoModel.find({petId:req.params.petId }).exec().then(result=>{
        res.status(200).send(result)
      }).catch(err=> res.status(500).send(err));
  })
  module.exports = router;