import express from "express";
import { quotes } from "./../data/index.js";
import paginate from "../utils/index.js";

const router = express.Router();

// Gets a random quote - no auth
router.get("/", (req, res) => {
  const rand = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[rand];
  res.status(200).json(randomQuote);
});

// Gets all quotes paginated - api-key or token
router.get("/quotes", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const resData = paginate(parseInt(page), parseInt(limit), quotes);
  if (!resData.length) {
    return res.status(400).json({
      error: "No data available",
    });
  }
  res.status(200).json(resData);
});

// Register a new user
router.post("/register", (req, res) => {
  console.log("registration");
  res.status(200).json({ status: "You have succesfully registered" });
});

// Get single quote - basic auth
router.get("/:id", (req, res) => {
  console.log(req.headers);
  const { id } = req.params;
  res.status(200).json({ quote: "Here is it" });
});

export default router;
