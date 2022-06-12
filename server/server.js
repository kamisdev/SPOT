/*
 * * Why can't you join here?
 * ? What makes you to do that?
*/

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const config = require("./config");
var helmet = require("helmet");
var app = express();
const http = require("http");
const socketIo = require("socket.io");
var port = process.env.PORT || 5000;
var passport = require("passport");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "spotdb",
    useFindAndModify: false,
  })
  .then(() => console.log("DB connnection successful!"))
  .catch((e) => console.log("DB connection error: ", e));

app.use(helmet());
app.set("key", process.env.KEY);
app.use(cookieParser()); //read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "spot_cookie_secret",
    resave: true,
    saveUninitialized: true,
  })
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.use(passport.initialize());
app.use(passport.session());

/*
app.use((req, res, next) => {
    
  if (config.anonymousURL.includes(req.originalUrl)) {
      next();
    } else {
      let token = req.body.token || req.query.token || req.headers['x-access-token'];
    
      if (token) {
        jwt.verify(token, app.get('key'), function(err, decoded) {       
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        return res.status(403).send('No token provided.');  
      }    
    }  
  });*/

app.get("/testconn", (req, res) => {
  console.log("working");
  res.send("working");
});

const user = require("./routes/user");
app.use("/user", user);

const pet = require("./routes/pet");
app.use("/pet", pet);

const location = require("./routes/location");
app.use("/location", location);

const photo = require("./routes/photo");
app.use("/photo", photo);

const message = require("./routes/message");
app.use("/message", message);

const device = require("./routes/device");
app.use("/device", device);

const server = http.createServer(app);

const io = socketIo(server);
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
