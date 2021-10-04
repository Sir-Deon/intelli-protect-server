const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  sites: [],
  computers: [],
});

module.exports = mongoose.model("user", user);
