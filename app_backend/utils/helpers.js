const jwt = require("jsonwebtoken");

exports = {};

exports.getToken = async (user) => {
  const token = jwt.sign({ identifier: user._id }, "SecretKey");
  return token;
};

module.exports = exports;
