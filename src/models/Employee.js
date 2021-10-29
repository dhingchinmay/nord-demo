const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.default.isEmail(value)) {
          throw new Error("enter a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain any string character");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// generate token
EmployeeSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
//find user by its credentials
EmployeeSchema.statics.findUserByCredientials = async function (
  email,
  password
) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("unable to login ...!");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login...!");
  }
  return user;
};
//remove unwanted information from user object
EmployeeSchema.methods.toJSON = function () {
  const user = this;
  const userobj = user.toObject();
  delete userobj.password;
  delete userobj.tokens;
  return userobj;
};
EmployeeSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const User = mongoose.model("User", EmployeeSchema);

module.exports = User;

// sudo mongod --port 27000 --dbpath /home/lcom/Desktop/mongodb-db/
