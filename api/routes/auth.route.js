const express = require("express");
const signup = require("../controllers/auth.controller.js");

const authRouter = express.Router();

authRouter.post("/signup", signup);

module.exports = authRouter;
