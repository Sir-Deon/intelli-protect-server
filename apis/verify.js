const jwt = require("jsonwebtoken");
require("dotenv/config");

module.exports = function (req, res, next) {
  if (!req.headers["authorization"]) {
    return res.send("No token found");
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) return res.send("Invalid or Expired token");
    req.payload = payload;
    next();
  });
};
