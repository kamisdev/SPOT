require('dotenv').config();
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URI,{useNewUrlParser: true, useUnifiedTopology: true, dbName: 'SPOT',useFindAndModify: false});
var db = mongoose.connection;
db.on('error', err => {  
    console.log('MongoDB connection error:');
    console.log(err);
    process.exit(0);
}); 

var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
    userId: String,
    deviceId: String
});

var DeviceModel = mongoose.model('devices', DeviceSchema, 'devices' );

module.exports = DeviceModel