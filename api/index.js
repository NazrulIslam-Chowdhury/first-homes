const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.hnlrj23.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send(`Welcome to server ${port}`);
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
