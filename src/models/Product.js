const mongoose = require("mongoose");
const validator = require("validator");
const productSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    birthPlace: {
      type: String,
      ref: "User",
    },
    joinDate: {
      type: String,
      ref: "User",
    },
    department: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    panCardNumber: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    gender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    salary: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    country: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    state: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    district: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    zipcode: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    dob: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Negative votes not allowed");
        }
      },
    },
    comments: [
      {
        text: {
          type: String,
        },
        postedBy: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
