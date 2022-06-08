require("dotenv").config();
const express = require("express");
var LocationModel = require("../models/location");
var UserModel = require("../models/user");
const LocationHelper = require("../helpers/locationHelper");
const { off } = require("../apn/apnprovider");

var router = express.Router();

router.post("/update", (req, res) => {
  const data = req.body;
  if (data.userId) {
    LocationModel.findOneAndUpdate(
      {
        userId: data.userId,
      },
      {
        ...data,
      },
      {
        new: true,
        upsert: true,
      }
    )
      .exec()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => res.status(500).send(err));
  } else {
    res.status(500).send("no userId");
  }
});

router.post("/users/nearby", async (req, res) => {
  try {
    const { activeUsers, radius, latitude, longitude } = req.body;
    console.log("body: ", req.body);

    if (activeUsers) {
    } else {
      const offset = LocationHelper.distanceOffset(radius);
      const latUpper = latitude + offset;
      const latLower = latitude - offset;
      const lngUpper = longitude + offset;
      const lngLower = longitude - offset;
      const users = await UserModel.find({
        latitude: { $gte: latLower, $lte: latUpper },
        longitude: { $gte: lngLower, $lte: lngUpper },
      });

      const nearbyUsers = [];
      users.forEach((user) => {
        const distance = LocationHelper.calculateDistance(
          { latitude, longitude },
          { latitude: user.latitude, longitude: user.longitude },
          "km"
        );
        if (distance <= radius) {
          nearbyUsers.push(user);
        }
      });

      return res.status(200).send(nearbyUsers);
    }
  } catch (e) {
    console.log("error: ", e);
    return res.status(500).send(e);
  }
});

router.post("/around", function (req, res) {
  const data = req.body;
  const radiusCoord = data.radius / 1852;
  const latUpper = data.latitude + radiusCoord;
  const latLower = data.latitude - radiusCoord;
  const longUpper = data.longitude + radiusCoord;
  const longLower = data.longitude - radiusCoord;

  LocationModel.find({
    latitude: {
      $gte: latLower,
      $lte: latUpper,
    },
    longitude: {
      $gte: longLower,
      $lte: longUpper,
    },
  })
    .exec()
    .then((result) => {
      let ids = [];
      result.map((i) => {
        ids.push(i.userId);
      });
      UserModel.find()
        .where("_id")
        .in(ids)
        .exec((err, records) => {
          let userLoc = records.map((record, index) => {
            if (record._id.toString() === ids[index]) {
              return {
                ...record._doc,
                location: result[index],
              };
            }
          });
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).send(userLoc);
        });
    })
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
