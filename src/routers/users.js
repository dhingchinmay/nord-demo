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
  console.log(req.body);
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

userRoutes.delete("/:id", async function (req, res) {
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
// //category
// userRoutes.post('/category', (req, res) => {

// })

userRoutes.patch("/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({
      _id,
    });
    if (!user) {
      return res.status(404).send({ error: "No user found!" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        user: user.name,
        user: user.email,
        user: user.password,
      },
      { new: true }
    );
    res.status(202).send(updatedUser);
  } catch (error) {
    console.log("error", error);
    res.status(404).send(error);
  }
});

userRoutes.post("/add", async (req, res) => {
  try {
    console.log("body", req.body);
    const { name, email, password } = req.body;
    // const existingEmp = await Employee.findOne({ email: req.body.email });
    // if (existingEmp) {
    //   return res.status(400).send({ error: "Email already in use !" });
    // }
    const emp = await new Employee({
      Name: name,
      email,
      password,
    }).save();
    res.send({ emp });
    // const token = await emp.generateToken();
    // res.status(201).send({ emp });
    // res.send({ emp, empDetail });
  } catch (error) {
    console.log("Error ", error);
    res.status(400).send(error.message);
  }
});

module.exports = userRoutes;
