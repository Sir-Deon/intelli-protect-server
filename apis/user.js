const router = require("express").Router();

const {
  login,
  signup,
  blocksites,
  unblocksites,
  getSites,
  auth_desktop,
  get_code,
  check_auth,
} = require("../controller/user");

router.get("/", (req, res) => [res.send("hello there")]);

router.get("/get_code", (req, res) => [get_code(req, res)]);

router.get("/check_auth/:code", (req, res) => [check_auth(req, res)]);

router.post("/auth_desk", (req, res) => [auth_desktop(req, res)]);

router.get("/get_sites", (req, res) => [getSites(req, res)]);

router.post("/sign_up", (req, res) => [signup(req, res)]);
router.post("/login", (req, res) => [login(req, res)]);

module.exports = router;
