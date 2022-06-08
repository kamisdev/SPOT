require("dotenv").config();
var mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "SPOT",
});
var db = mongoose.connection;
db.on("error", (err) => {
  console.log("MongoDB connection error:");
  console.log(err);
  process.exit(0);
});

var Schema = mongoose.Schema;

var PetSchema = new Schema({
  userId: String,
  petName: String,
  breed: String,
  height: Number,
  weight: Number,
  birthDate: Date,
  gender: Boolean,
  behaviours: Array,
  dislikes: String,
  picture: String,
});

var PetModel = mongoose.model("pets", PetSchema, "pets");

module.exports = PetModel;
