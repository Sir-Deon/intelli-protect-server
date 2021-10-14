require("dotenv/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Code = require("../models/code");
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
        id: newUser._id,
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
  console.log(email);
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
      id: user._id,
      token: token,
    });
  });
};

const editProfile = async (req, res) => {
  const { id, email, password } = req.body;
  if (password) {
    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPasswords = await bcrypt.hash(password, salt);
    User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          email: email,
          password: hashedPasswords,
        },
      }
    )
      .then(() => {
        res.json({ success: true, email: email });
      })
      .catch(() => {
        res.json({ success: false, msg: "Something went wrong !!" });
      });
  } else {
    User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          email: email,
        },
      }
    )
      .then(() => {
        res.json({ success: true, email: email });
      })
      .catch(() => {
        res.json({ success: false, msg: "Something went wrong !!" });
      });
  }
};

const get_code = (req, res) => {
  res.json({
    code: "intelli-" + uuidv4(),
  });
};

const check_auth = async (req, res) => {
  const { id } = req.params;
  let computer = await Code.findOne({ code: id });
  if (computer) {
    res.json({
      success: true,
      userId: computer.owner,
    });
  } else {
    res.json({
      success: false,
    });
  }
};

const auth_desktop = async (req, res) => {
  const { code, id, name } = req.body;
  let user = await User.findOne({ _id: id });
  user.computers.push({
    name: name,
    code: code,
  });
  let newPcCode = new Code({
    owner: id,
    code: code,
  });
  newPcCode.save();
  User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        computers: user.computers,
      },
    }
  )
    .then(() => res.json({ success: true }))
    .catch(() => res.json({ success: false, msg: "Something went wrong !!" }));
};

const getComputer = async (req, res) => {
  let id = req.params.id;
  let user = await User.findOne({ _id: id });
  res.send(user.computers);
};

const editComputer = async (req, res) => {
  const userId = req.params.id;
  const { name, id } = req.body;
  const user = await User.findOne({ _id: userId });
  await user.computers.forEach(computer => {
    if (computer.code === id) {
      computer.name = name;
    }
  });
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $set: {
        computers: user.computers,
      },
    }
  );
  res.json({ success: true });
};

const deleteComputer = async (req, res) => {
  const { userId, code } = req.params;
  await Code.findOneAndDelete({ code: code });
  let user = await User.findOne({ _id: userId });
  user.computers.forEach((computer, index) => {
    if (computer.code === code) {
      user.computers.splice(index, 1);
    }
  });
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $set: {
        computers: user.computers,
      },
    }
  );
  return res.json({
    success: true,
  });
};

const blocksites = async (req, res) => {
  const { name, blocked, userId } = req.body;
  let website = {
    id: uuidv4(),
    name: name,
    blocked: blocked,
  };
  let user = await User.findOne({ _id: userId });
  user.sites.push(website);
  User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        sites: user.sites,
      },
    }
  )
    .then(() => {
      res.json({ success: true });
    })
    .catch(() => {
      res.json({ success: false, msg: "Something went wrong !!" });
    });
};

const editSite = async (req, res) => {
  const userId = req.params.id;
  const { id, name, blocked } = req.body;
  const user = await User.findOne({ _id: userId });
  await user.sites.forEach(site => {
    if (site.id === id) {
      site.name = name;
      site.blocked = blocked;
    }
  });
  User.findOneAndUpdate({ _id: userId }, { $set: { sites: user.sites } })
    .then(() => [res.json({ success: true })])
    .catch(() => {
      res.json({ success: false, msg: "Something went wrong !!" });
    });
};

const getSites = async (req, res) => {
  const userId = req.params.id;
  let user = await User.findOne({ _id: userId });
  res.send(user.sites);
};

const deleteSite = async (req, res) => {
  const { userId, id } = req.params;
  let user = await User.findOne({ _id: userId });
  await user.sites.forEach((site, index) => {
    if (site.id === id) {
      user.sites.splice(index, 1);
    }
  });
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $set: {
        sites: user.sites,
      },
    }
  );
  return res.json({
    success: true,
  });
};

const deleteAll = async (req, res) => {
  const id = req.params.userId;
  User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        sites: [],
      },
    }
  ).then(() => res.json({ success: true }));
};

module.exports = {
  login,
  blocksites,
  editSite,
  signup,
  getSites,
  auth_desktop,
  get_code,
  check_auth,
  getComputer,
  editComputer,
  deleteComputer,
  deleteSite,
  editProfile,
  deleteAll,
};
