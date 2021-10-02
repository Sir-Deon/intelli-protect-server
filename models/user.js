const mongoose = require("mongoose");

const site = new mongoose.Schema({
  name: {
    type: String,
  },
  computerIDs: [],
  blocked: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Date,
  },
});

const computer = new mongoose.Schema({
  name: {
    type: String,
  },
  code: {
    type: String,
  },
});

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
  sites: [site],
  computers: [computer],
});

module.exports = mongoose.model("user", user);
