require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var AWS = require("aws-sdk");
var uuid = require("uuid");
const multer = require("multer");
require("../passport/facebook");
require("../passport/google");

var passport = require("passport");
var moment = require("moment");

var ep = new AWS.Endpoint("s3.wasabisys.com");
var s3 = new AWS.S3({
  endpoint: ep,
});
const Storage = multer.memoryStorage();

const upload = multer({
  storage: Storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

var router = express.Router();
var UserModel = require("../models/user");

// PASSPORT

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
//router.get("/auth/facebook", passport.authenticate("facebook",{ scope: ['email','user_gender','user_birthday','user_location','user_birthday'] }));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/user/fail",
  }),
  function (req, res) {
    const user = req.user;
    const {
      id,
      email,
      first_name,
      last_name,
      gender,
      birthday,
      location,
      picture,
    } = user._json;
    const userData = {
      facebookId: id,
      email,
      firstName: first_name,
      lastName: last_name,
      birthDate: birthday ? moment(birthday, "MM-DD-YYYY").toDate() : undefined,
      gender: gender !== "female",
      address: location ? location.name : undefined,
      picture: picture ? picture.data.url : undefined,
    };

    UserModel.findOneAndUpdate(
      {
        facebookId: id,
      },
      {
        ...userData,
      },
      {
        new: true,
        upsert: true,
      }
    ).then((result) => {
      res.redirect("OAuthLogin://login?user=" + JSON.stringify(result));
    });
  }
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "email",
      "profile",
      "https://www.googleapis.com/auth/user.birthday.read",
    ],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/user/fail",
  }),
  (req, res) => {
    const user = req.user;
    const { sub, email, given_name, family_name, picture } = user._json;
    const userData = {
      googleId: sub,
      email,
      firstName: given_name,
      lastName: family_name,
      picture: picture,
    };
    UserModel.findOneAndUpdate(
      {
        googleId: sub,
      },
      {
        ...userData,
      },
      {
        new: true,
        upsert: true,
      }
    ).then((result) => {
      res.redirect("OAuthLogin://login?user=" + JSON.stringify(result));
    });
  }
);

router.get("/auth/apple", (req, res) => {
  console.log(req.query);
  const query = req.query;
  const userData = {
    appleId: query.user,
    email: query.email,
    firstName: query.givenName,
    lastName: query.familyName,
  };
  UserModel.findOneAndUpdate(
    {
      appleId: query.user,
    },
    {
      ...userData,
    },
    {
      new: true,
      upsert: true,
    }
  ).then((result) => {
    console.log(result);
    res.redirect("OAuthLogin://login?user=" + JSON.stringify(result));
  });
});

router.get("/fail", (req, res) => {
  res.redirect("OAuthLogin://login?user=");
});
/*
router.get("/success", (req, res) => {
  console.log(req.user);
  const user = req.user
  const { id, email, first_name, last_name, gender, birthday,location,picture } = user._json;
  const userData = {
    facebookId: id,
    email,
    firstName: first_name,
    lastName: last_name,
    birthDate: moment(birthday,'MM-DD-YYYY').toDate(),
    gender: gender!=='male',
    address: location.name,
    picture: picture.data.url,
  };
  
  UserModel.findOneAndUpdate(
    {
      facebookId:id 
    },
    {
      ...userData
    },
    {
      new: true,
      upsert:true
    }
    ).then((result)=>{
      res.status(200).send(result);
    })
});*/

router.get("/logout", function (req, res) {
  req.logout();
  res.send("logged out");
});

// MAIN

router.post("/token", (req, res) => {
  const data = req.body;
  console.log(data);

  UserModel.findOne({
    username: data.username,
  }).then((result) => {
    if (result !== null) {
      if (bcrypt.compareSync(data.password, result.password)) {
        const { password, ...payload } = result._doc;

        var token = jwt.sign(payload, process.env.KEY, {
          expiresIn: "30d",
        });

        res.status(200).send({
          ...payload,
          token,
        });
      } else {
        console.log("incorrect");
        res.status(500).send("Incorrect Password");
      }
    } else {
      res.status(500).send("User not existent");
    }
  });
});

router.post("/register", (req, res) => {
  const data = req.body;
  if (
    !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      data.email
    )
  ) {
    return res.status(500).send("Invalid email address.");
  }

  UserModel.findOne({
    username: data.username,
  })
    .then((result) => {
      if (result === null) {
        let hashpass = bcrypt.hashSync(
          data.password,
          parseInt(process.env.SALT)
        );
        UserModel.create(
          {
            ...data,
            password: hashpass,
          },
          function (err, small) {
            if (err) res.status(500).send(err);
            res.status(200).send("Succefully registered user.");
          }
        );
      } else {
        res.status(500).send("Username already exists.");
      }
    })
    .catch((err) => res.status(500).send(err));
});

router.get("/user/:userId", function (req, res) {
  UserModel.findOne({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => res.status(500).send(err));
});

router.post("/uploadfile", upload.single("image"), (req, res, next) => {
  const file = req.file;
  console.log("file", file);
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  var params = {
    Bucket: "gadaispot",
    Key: file.originalname + "-" + uuid.v4() + ".jpg",
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  s3.putObject(params)
    .promise()
    .then((data) => {
      const key = params.Key;
      res.status(200).send({ key });
      console.log({ ...data, key });
    })
    .catch((err) => console.log("error", err));
});

router.post("/:userId/update", (req, res) => {
  const data = req.body;
  console.log(data);
  UserModel.updateOne({ _id: req.params.userId }, { ...data }, (err) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send("Profile updated successfully!");
  });
});

module.exports = router;
