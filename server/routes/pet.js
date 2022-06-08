require("dotenv").config();
const express = require("express");
var PetModel = require("../models/pet");
var router = express.Router();
const UserHelper = require("../helpers/userHelper");

router.post("/register", (req, res) => {
  const data = req.body;
  console.log(data);
  PetModel.create(
    {
      ...data,
    },
    function (err) {
      if (err) res.status(500).send(err);
      res.status(200).send("Successfully registered pet.");
    }
  );
});

router.get("/:petId", function (req, res) {
  PetModel.findOne({ _id: req.params.petId })
    .exec()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => res.status(500).send(err));
});

router.post("/update/:petId", function (req, res) {
  const data = req.body;
  console.log(data);
  PetModel.updateOne(
    {
      _id: req.params.petId,
    },
    {
      ...data,
    },
    function (err, small) {
      if (err) res.status(500).send(err);
      res.status(200).send("Successfully updated pet.");
    }
  );
});

router.delete("/:petId", function (req, res) {
  PetModel.deleteOne({ _id: req.params.petId })
    .exec()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => res.status(500).send(err));
});

router.get("/ownedby/:userId", async (req, res) => {
  try {
    const pets = await PetModel.find({ userId: req.params.userId });
    const owner = await UserHelper.getUser(req.params.userId);
    pets.forEach((pet) => {
      pet.set("owner", owner, { strict: false });
    });
    return res.status(200).send(pets);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
