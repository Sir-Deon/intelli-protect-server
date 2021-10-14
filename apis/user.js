const router = require("express").Router();

const {
  login,
  signup,
  blocksites,
  editSite,
  deleteSite,
  getSites,
  auth_desktop,
  get_code,
  check_auth,
  getComputer,
  editComputer,
  deleteComputer,
  editProfile,
} = require("../controller/user");

router.get("/", (req, res) => [res.send("hello there")]);

router.get("/get_code", (req, res) => [get_code(req, res)]);

router.get("/check_auth/:id", (req, res) => [check_auth(req, res)]);

router.post("/auth_desk", (req, res) => [auth_desktop(req, res)]);
router.get("/get_computers/:id", (req, res) => [getComputer(req, res)]);
router.put("/edit_computer/:id", (req, res) => [editComputer(req, res)]);
router.delete("/delete_computer/:userId/:code", (req, res) => [
  deleteComputer(req, res),
]);

router.get("/get_sites/:id", (req, res) => [getSites(req, res)]);
router.post("/block_site", (req, res) => [blocksites(req, res)]);
router.put("/edit_site/:id", (req, res) => [editSite(req, res)]);
router.delete("/delete_site/:userId/:id", (req, res) => [deleteSite(req, res)]);

router.post("/sign_up", (req, res) => [signup(req, res)]);
router.post("/login", (req, res) => [login(req, res)]);
router.put("/edit_profile", (req, res) => [editProfile(req, res)]);

module.exports = router;
