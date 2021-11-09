const express = require("express");
const employeeRoutes = new express.Router();
const Employee = require("../models/Employee");
// const EmployeeDetail = require("../models/EmployeeDetail");
const auth = require("../middleware/auth");
const User = require("../models/User");
employeeRoutes.get("/", (req, res) => {
  res.send("Test , Hello world");
});
//user register
employeeRoutes.post("/add", async (req, res) => {
  try {
    console.log("body", req.body);
    const { name, email, phone, dob, gender } = req.body;
    // const existingEmp = await Employee.findOne({ email: req.body.email });
    // if (existingEmp) {
    //   return res.status(400).send({ error: "Email already in use !" });
    // }
    const emp = await new Employee({
      Name: name,
      email,
      phone,
      dob,
      gender,
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
//get all product
employeeRoutes.get("/all", async (req, res) => {
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

//update employee
employeeRoutes.put("/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const employee = await Employee.findOne({
      _id,
    });
    if (!employee) {
      return res.status(404).send({ error: "No user found!" });
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(202).send(updatedEmployee);
  } catch (error) {
    console.log("error", error);
    res.status(404).send(error);
  }
});

module.exports = employeeRoutes;
