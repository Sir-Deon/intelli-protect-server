const mongoose = require("mongoose");

const sites = new mongoose.Schema({
  name: {
    type: String,
  },
  blocked: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Date,
  },
});

const user = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  sites: [sites],
});

module.exports = mongoose.model("user", user);
