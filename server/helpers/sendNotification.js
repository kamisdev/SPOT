require('dotenv').config();
var DeviceModel = require('../models/device')
var _ = require('lodash');
var axios = require('axios');

function sendNotification(userId,body){
    return new Promise((resolve,reject)=>{
        DeviceModel.find({userId}).then(deviceResults=>{
          
            const data = {
              app_id: process.env.ONESIGNAL_APP_ID,
              include_player_ids: _.map(deviceResults, (i)=>{
                return i.deviceId
              }),
              ...body,
            };
            axios.post('https://onesignal.com/api/v1/notifications', 
            data,
            {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + process.env.ONESIGNAL_SERVER_API
                }
            })
            .then(result=>{
                resolve(result.data);
            })
            .catch(err=>{
                reject(err)
            })
            
          }).catch(err=> reject(err));
    })
    
}
module.exports = sendNotification