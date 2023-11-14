const test = (req, res) => {
  res.json({
    message: "Server is running on port 5000",
  });
};

module.exports = test;
