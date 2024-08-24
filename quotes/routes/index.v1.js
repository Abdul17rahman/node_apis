import express from "express";
import {
  quotes,
  addQuote,
  delQuote,
  quoteExists,
  getRandQuote,
  addToken,
  addKey,
} from "./../data/index.js";
import { registerUser, userExist } from "../data/users.js";
import { paginate } from "../utils/index.js";
import { apikeyAuth, basicAuth, tokenAuth } from "../middleware.js";
import {
  generateAPIKEY,
  generateRefreshToken,
  generateAccessToken,
} from "../utils/index.js";

const router = express.Router();

// Gets a random quote - no auth
router.get("/", (req, res) => {
  res.status(200).json(getRandQuote());
});

// Gets all quotes paginated - api-key or token
router.get("/quotes", basicAuth, (req, res) => {
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

// Register a new user - basic auth
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing registration credentials." });
  }
  const registeredUser = registerUser({
    username,
    password: Buffer.from(password).toString("base64"),
  });
  res.status(201).json({
    id: registeredUser.id,
    username: registeredUser.username,
    status: "User successfully registered.",
  });
});

// Get single quote - basic auth
router.get("/quotes/:id", tokenAuth, (req, res) => {
  const { id: _id } = req.params;
  const foundQuote = quoteExists(_id);
  if (!foundQuote) {
    return res.status(400).json({
      error: "Quote not found.!",
    });
  }
  res.status(200).json(foundQuote);
});

router.post("/quotes", basicAuth, (req, res) => {
  const { quote, author, category } = req.body;
  const newQuote = {
    quote,
    author,
    category,
  };
  const result = addQuote(newQuote);
  res.status(201).json(result);
});

router.delete("/quotes/:id", tokenAuth, (req, res) => {
  const { id } = req.params;
  const deleted = delQuote(id);
  if (deleted) {
    res.status(200).json({ ...deleted, status: "Quote successfully deleted." });
  } else {
    res.status(404).json({
      error: "Quote doesn't exist.",
    });
  }
});

router.post("/generateToken", basicAuth, (req, res) => {
  const user = userExist(req.user);
  if (!user) {
    return res
      .status(401)
      .json({ error: "User doesn't exist, please register" });
  }
  const refreshToken = generateRefreshToken({
    id: user.id,
    username: user.username,
  });
  const accessToken = generateAccessToken({
    id: user.id,
    username: user.username,
  });
  addToken(refreshToken);
  res
    .status(200)
    .json({ id: user.id, name: user.username, refreshToken, accessToken });
});

router.post("/generateAPIKey", basicAuth, (req, res) => {
  const user = userExist(req.user);

  if (!user) {
    return res
      .status(401)
      .json({ error: "User doesn't exist, please register." });
  }
  const apiKey = generateAPIKEY(user);
  addKey(apiKey);

  res.status(200).json({ id: user.id, name: user.username, apiKey });
});

export default router;
