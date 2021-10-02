const mongoose = require("mongoose");

const code = new mongoose.Schema({
  code: {
    type: String,
  },
  owner: {
    type: String,
  },
});

module.exports = mongoose.model("Code", code);
