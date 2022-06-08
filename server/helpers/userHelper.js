const UserModel = require("../models/user");

async function getUser(userId) {
  const user = await UserModel.findOne({ _id: userId });
  return user;
}

const helper = { getUser };
module.exports = helper;
