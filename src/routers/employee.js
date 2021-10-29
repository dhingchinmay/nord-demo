const express = require("express");
const employeeRoutes = new express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
// default welcome
employeeRoutes.get("/", (req, res) => {
  res.json("Hello world ! welcome").send();
});

// routes for users
//user register
employeeRoutes.post("/register", async (req, res) => {
  console.log("fsdif");
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
employeeRoutes.post("/login", async (req, res) => {
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
employeeRoutes.get("/logout", auth, async (req, res) => {
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
employeeRoutes.get("/all", async (req, res) => {
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
// employeeRoutes.post('/category', (req, res) => {

// })

module.exports = employeeRoutes;

employeeRoutes.delete("/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      return res.status(404).send();
    }
    res.send(deletedUser);
  } catch (error) {
    res.status(404).send(error);
  }
});
