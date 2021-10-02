require("dotenv/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

const signup = async (req, res) => {
  const { email, password } = req.body;
  // Check if email exists
  const emailExist = await User.findOne({ email: email });
  if (emailExist)
    return res.json({
      success: false,
      msg: "User with this email already exists!!",
    });

  // Encrypt the password
  const salt = await bcrypt.genSalt(10);
  const hashedPasswords = await bcrypt.hash(password, salt);

  // Create New Sub Admin
  const user = new User({
    email: email,
    password: hashedPasswords,
  });

  try {
    let newUser = await user.save();
    // Create and assign a token
    const payload = {
      _id: newUser._id,
      email: newUser.email,
    };
    jwt.sign(payload, process.env.TOKEN_SECRET, (err, token) => {
      res.status(200).json({
        success: true,
        email: email,
        token: token,
      });
    });
  } catch (error) {
    return res.json({
      success: false,
      msg: "Something went wrong!!",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email exists
  const user = await User.findOne({ email: email });
  if (!user)
    return res.json({
      success: false,
      msg: "E-mail does not exist!!",
    });

  // Check if password is correct
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass)
    return res.json({
      success: false,
      msg: "Invalid Password!!",
    });

  // Create and assign a token
  const payload = {
    _id: user._id,
    email: user.email,
  };
  jwt.sign(payload, process.env.TOKEN_SECRET, (err, token) => {
    res.status(200).json({
      success: true,
      email: email,
      token: token,
    });
  });
};

const auth_desktop = (req, res) => {
  let desktopCode = req.params.code;
  if (desktopCode === "code") {
    res.json({
      code: "intelli-" + uuidv4(),
    });
  } else {
    console.log(desktopCode);
    res.json({
      success: true,
    });
  }
};

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
  login,
  blocksites,
  unblocksites,
  signup,
  getSites,
  auth_desktop,
};
