const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  console.log(req.body);
  const { userName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ userName, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = signup;
