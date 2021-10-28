const express = require("express");
const userRoutes = new express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
// default welcome
userRoutes.get("/", (req, res) => {
  res.json("Hello world ! welcome").send();
});

// routes for users
//user register
userRoutes.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({ error: "Email already in use !" });
    }
    const user = await new User(req.body).save();
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
//login processing route
userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredientials(email, password);
    const token = await user.generateToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(404).send({ error });
  }
});
//logout user
userRoutes.get("/logout", auth, async (req, res) => {
  try {
    const index = req.user.tokens.indexOf(req.token);
    req.user.tokens.splice(index, 1);
    await req.user.save();
    res.json("Logout successfully").send();
  } catch (error) {
    res.status(400).send({ error });
  }
});

//get all users
userRoutes.get("/all", async (req, res) => {
  try {
    const users = await User.find({});
    if (users == null) {
      return res.status(400).send({ error: "No products found ! please add " });
    }
    return res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ error });
  }
});
// //category
// userRoutes.post('/category', (req, res) => {

// })

module.exports = userRoutes;
