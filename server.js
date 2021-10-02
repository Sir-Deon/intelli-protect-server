const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");

const server = express();

// Middlewares
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

// connect to database
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

// APIs
const user = require("./apis/user");

server.use("/api", user);

const port = process.env.PORT;

server.listen(port, () => [
  console.log(`Intelli Protect server listening on ${port}`),
]);
