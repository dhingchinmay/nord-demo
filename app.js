// main file
const express = require("express");
const userRoutes = require("./src/routers/users");
const categoryRoutes = require("./src/routers/category");
const productRoutes = require("./src/routers/products");
const employeeRoutes = require("./src/routers/employee");
require("./src/db/mongoose");
const app = express();
//features to user (ie routings)
app.use(express.json());
app.use("/users", userRoutes);
app.use("/category", categoryRoutes);
app.use("/products", productRoutes);
app.use("/employee", employeeRoutes);
module.exports = app;
