const router = require("express").Router();
const verify = require("./verify");
const { v4: uuidv4 } = require("uuid");
const {
  login,
  logout,
  signup,
  blocksites,
  unblocksites,
  getSites,
} = require("../controller/user");

router.get("/", (req, res) => [res.send("hello there")]);

router.get("/auth", (req, res) => [
  res.json({
    success: true,
    code: uuidv4(),
  }),
]);

router.get("/get_sites", (req, res) => [getSites(req, res)]);
module.exports = router;
