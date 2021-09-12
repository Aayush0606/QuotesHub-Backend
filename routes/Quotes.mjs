import Express from "express";
import Quotes from "../models/Quotes.mjs";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const { Schema } = mongoose;
const Router = Express.Router();
import fetchUser from "../middleware/FetchUser.mjs";
import { body, validationResult } from "express-validator";

//Get all user saved quotes :GET "api/quotes/getquotes"
Router.get("/getquotes", fetchUser, async (req, res) => {
  const userQuotes = await Quotes.find(req.body.user);
  res.json(userQuotes);
});

//Add a quotes in user's saved quotes :POST "api/quotes/addquotes"
Router.post(
  "/addquotes",
  [
    //Validation (Will delete later) using express validator
    body("anime", "Give an anime name").not().isEmpty(),
    body("quote", "Give a quote").not().isEmpty(),
    body("character", "What am i supposed to do without character")
      .not()
      .isEmpty(),
  ],
  fetchUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { anime, quote, character } = req.body;
      //checking for same orevious quote
      const checkPrev = await Quotes.findOne({ quote });
      if (checkPrev) {
        return res.status(400).send("quote already exist");
      }
      //adding new quote
      const newQuote = new Quotes({
        user: req.user.id,
        anime,
        quote,
        character,
      });
      const savedQuote = await newQuote.save();
      res.json(savedQuote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Database error");
    }
  }
);

//Delete a quotes in user's saved quotes :POST "api/quotes/deletequotes"
Router.post(
  "/deletequotes",
  //(will remove later)
  [body("quote", "Enter a quote to delete").not().isEmpty()],
  fetchUser,
  async (req, res) => {
    try {
      const { quote } = req.body;
      //search for quote
      let found = await Quotes.findOne({ quote });
      if (!found) {
        //might delete later
        return res.status(404).json({ error: "Not Found" });
      }
      //checking whether legit user is trying to access
      if (found.user.toString() !== req.user.id) {
        return res.status(401).send("Access Denied");
      }
      //deleteing
      found = await Quotes.findOneAndDelete({ quote });
      res.json({ Delete: "Success" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Database error");
    }
  }
);

export default Router;
