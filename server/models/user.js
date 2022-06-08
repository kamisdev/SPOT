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

var UserSchema = new Schema({
  facebookId: String,
  googleId: String,
  appleId: String,
  email: String,
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  birthDate: Date,
  gender: Boolean,
  contact: String,
  address: String,
  picture: String,
  latitude: Number,
  longitude: Number,
});

var UserModel = mongoose.model("users", UserSchema, "users");

module.exports = UserModel;
