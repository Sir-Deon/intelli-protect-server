require("dotenv/config");
const User = require("../models/user");

const signup = (req, res) => {};

const login = (req, res) => {};

const logout = (req, res) => {};

const blocksites = (req, res) => {};

const unblocksites = (req, res) => {};

const getSites = (req, res) => {
  const sites = [
    {
      name: "remove.bg",
      duration: "1h",
      blocked: true,
    },
    {
      name: "facebook.com",
      duration: "1h",
      blocked: false,
    },
    {
      name: "flutter.dev",
      duration: "1h",
      blocked: false,
    },
  ];
  res.send(sites);
};

module.exports = {
  logout,
  login,
  blocksites,
  unblocksites,
  signup,
  getSites,
};
