import express from "express";
import { quotes, addQuote } from "./../data/index.js";
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
  const currentPage = parseInt(page);
  const quotesPerPage = parseInt(limit);

  const resData = paginate(currentPage, quotesPerPage, quotes);
  if (!resData.data.length) {
    return res.status(400).json({
      error: "No data available",
    });
  }
  res.status(200).json(resData);
});

// Register a new user
router.post("/register", (req, res) => {
  const [type, authCredentials] = req.headers.authorization.split(" ") || "";
  const [username, password] = Buffer.from(authCredentials, "base64")
    .toString()
    .split(":");
  console.log(username, password);
  res.status(200).json({ status: "You have succesfully registered" });
});

// Get single quote - basic auth
router.get("/quote/:id", (req, res) => {
  const { id: _id } = req.params;
  const foundQuote = quotes.find(({ id }) => id === _id);
  if (!foundQuote) {
    return res.status(400).json({
      error: "Quote not found.!",
    });
  }
  res.status(200).json(foundQuote);
});

router.post("/quotes", (req, res) => {
  const { quote, author, category } = req.body;
  const newQuote = {
    quote,
    author,
    category,
  };
  const result = addQuote(newQuote);
  console.log("added quote");
  res.status(201).json(result);
});

export default router;
