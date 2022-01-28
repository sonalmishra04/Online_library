const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//Register
//Create
router.post("/register", async (req, res) => {
  try {
    // console.log(await bcrypt.hash(req.body.password, 8));
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
    });

    const user = await newUser.save();
    const token = await jwt.sign({ _id: user._id.toString() }, "monday");
    // console.log(user.tokens, token);
    user.tokens.push({
      token,
    });
    // console.log(user.tokens);
    await user.save();
    // console.log(user);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");

    const validate = await bcrypt.compare(req.body.password, user.password);
    !validate && res.status(400).json("Wrong credentials!");
    const token = await jwt.sign({ _id: user._id.toString() }, "monday");
    user.tokens.push({
      token,
    });
    await user.save();

    res.status(200).json({
      user,
      token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
