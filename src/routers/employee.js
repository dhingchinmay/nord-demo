const express = require("express");
const employeeRoutes = new express.Router();
const Employee = require("../models/Employee");
const EmployeeDetail = require("../models/EmployeeDetail");
const auth = require("../middleware/auth");
const User = require("../models/User");
employeeRoutes.get("/", (req, res) => {
  res.send("Test , Hello world");
});
//user register
employeeRoutes.post("/add", auth, async (req, res) => {
  try {
    console.log("body", req.body.data);
    const {
      firstName,
      lastName,
      dob,
      birthPlace,
      joinDate,
      department,
      panCardNumber,
      gender,
      phoneNumber,
      email,
      salary,
      maritalStatus,
      country,
      state,
      district,
      zipcode,
    } = req.body.data;
    // const existingEmp = await Employee.findOne({ email: req.body.email });
    // if (existingEmp) {
    //   return res.status(400).send({ error: "Email already in use !" });
    // }
    const emp = await new Employee({
      firstName,
      lastName,
      email,
      dob,
      phone: phoneNumber,
      birth_place: birthPlace,
      join_date: joinDate,
      gender: gender,
      maritial_status: maritalStatus,
      pan_card_no: panCardNumber,
      created_by: req.user._id,
    }).save();
    const empDetail = await new EmployeeDetail({
      department,
      phone: phoneNumber,
      salary: salary,
      country,
      state,
      district,
      zip_code: zipcode,
      owner: emp._id,
    }).save();
    // const token = await emp.generateToken();
    // res.status(201).send({ emp });
    res.send({ emp, empDetail });
  } catch (error) {
    console.log("Error ", error);
    res.status(400).send(error.message);
  }
});
//get all product
employeeRoutes.get("/all", auth, async (req, res) => {
  try {
    const employees = await Employee.find({});
    if (employees == null) {
      return res
        .status(200)
        .send({ error: "No employees found ! please add " });
    }
    return res.status(200).send(employees);
  } catch (error) {
    res.status(500).send({ error });
  }
});
// //login processing route
// employeeRoutes.post("/login", async (req, res) => {
//   try {
//     // console.log("request fires");
//     const { email, password } = req.body;
//     // console.log("email, password", email, password, req.body);
//     const emp = await Employee.findUserByCredientials(email, password);
//     const token = await emp.generateToken();
//     res.status(200).send({ emp, token });
//   } catch (error) {
//     // console.log("Error joh!123R", error);
//     res.status(400).send({ error: error.message });
//   }
// });
employeeRoutes.delete("/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedEmp = await Employee.deleteOne({ _id });
    console.log("id,", _id);
    console.log("deletedEmp,", deletedEmp);
    res.status(202).send(deletedEmp);
  } catch (error) {
    res.status(500).send(error);
    console.log("error", error);
  }
});

//update product
employeeRoutes.patch("/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      title: req.body.user.toLowerCase().trim().split(" ").join(""),
    });
    if (!user) {
      return res.status(404).send({ error: "No category found!" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        user: user._id,
      },
      { new: true }
    );
    res.status(202).send(updatedUser);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = employeeRoutes;
