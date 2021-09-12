import Express from "express";
import User from "../models/User.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
const { Schema } = mongoose;
const Router = Express.Router();
const JWT_SCERET = process.env.JWT_SCERET;
import fetchUser from "../middleware/FetchUser.mjs";

//Create a user:Post "api/auth/newuser" {No auth req}
Router.post(
  "/signup",
  //validation using express-validator without creating user
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Name should be atleast 1 character long").isLength({
      min: 1,
    }),
    body("pass", "Password should be atleast 5 character long").isLength({
      min: 5,
    }),
  ],
  //express-check result fetched now entering uploading process
  async (req, res) => {
    //if express-validator fails
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //express-validator check passed
    //try catch for database error
    try {
      //checking previous user with same email
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json("Email already exist");
      }

      //no previous user with same email

      //doing hashing and salt to store hashed password instead of plain text
      const saltForPass = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.pass, saltForPass);

      user = await User.create({
        email: req.body.email,
        name: req.body.name,
        pass: hashedPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      //authtoken using jwt for verification purpose
      const authToken = jwt.sign(data, JWT_SCERET);

      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Database error");
    }
  }
);

//Authenticate a user:Post "api/auth/login" {auth req}
Router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("pass", "Password cannot be blank").not().isEmpty(),
  ],
  async (req, res) => {
    //if express-validator fails
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //express-validator check passed
    //try catch for database error
    try {
      const { email, pass } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send("Wromg credentials!!");
      } else {
        const checkPass = await bcrypt.compare(pass, user.pass);
        if (!checkPass) {
          return res.status(404).send("Wromg credentials!!");
        } else {
          const data = {
            user: {
              id: user.id,
            },
          };

          //authtoken using jwt for verification purpose
          const authToken = jwt.sign(data, JWT_SCERET);
          res.status(200).json({ authToken });
        }
      }
    } catch (error) {
      res.status(500).send("Database error");
    }
  }
);

//Get data from userSchema:POST "api/auth/getuser" {auth req}
Router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select("-pass");
    if (!user) {
      return res.send(401).json({ error: "Give correct auth token" });
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("Database error");
  }
});

export default Router;
