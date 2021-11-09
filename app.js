// main file
const express = require("express");
const userRoutes = require("./src/routers/users");
const employeeRoutes = require("./src/routers/employee");
require("./src/db/mongoose");
const app = express();
//features to user (ie routings)
app.use(express.json());
app.use("/users", userRoutes);
app.use("/employee", employeeRoutes);
module.exports = app;
