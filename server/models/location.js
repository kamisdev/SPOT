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

var LocationSchema = new Schema({
    userId: String,
    latitude: Number,
    longitude: Number,
    heading: Number
});

var LocationModel = mongoose.model('locations', LocationSchema, 'locations' );

module.exports = LocationModel