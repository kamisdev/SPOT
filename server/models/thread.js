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

var ThreadSchema = new Schema({
    member1Id: String,
    member1Name: String,
    member1Picture: String,
    member2Id: String,
    member2Name: String,
    member2Picture: String,
    lastMessage: String,
    timestamp: Date
});

var ThreadModel = mongoose.model('threads', ThreadSchema, 'threads' );

module.exports = ThreadModel