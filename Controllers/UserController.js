const Users = require("../Model/UserModel");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

//get techsupport

const gettechsupport = expressAsyncHandler(async (req, res) => {
  const users = Users.filter((user) => user.role === "techsupport");
  res.status(200).json(users);
});

module.exports = { gettechsupport };
