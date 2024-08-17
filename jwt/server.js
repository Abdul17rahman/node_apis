import * as dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const app = express();

const posts = [
  {
    username: "Abdul",
    title: "Post 1",
  },
  {
    username: "Hassan",
    title: "Post 2",
  },
];

let refresh_tokens = [];

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  message: {
    warning: "Limit has been exceeded - please try again after 10min.",
  },
});

function genAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: "15min" });
}

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ error: "You're not authenticated" });

  try {
    const autheticated = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = autheticated;
    next();
  } catch {
    res.status(401).json({ error: "Token expired or you're not authorized" });
  }
}

app.use(limiter);

app.use(express.json());

app.get("/posts", authenticate, (req, res) => {
  // console.log(req.user);
  req.res.json(posts.filter((p) => p.username == req.user.username));
});

app.post("/login", (req, res) => {
  const user = { username: "Abdul", password: "Abdul" };
  const accessToken = genAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET);
  refresh_tokens.push(refreshToken);
  res
    .status(200)
    .json({ access_token: accessToken, refresh_token: refreshToken });
});

// Logout or del refresh token
app.post("/logout", (req, res) => {
  const authHeader = req.headers["authorization"];
  const _token = authHeader && authHeader.split(" ")[1];

  refresh_tokens = refresh_tokens.filter((token) => token !== _token);
  res.status(200).json({ message: "Successfully logged out." });
});

// generates a new access token using the refresh token
app.post("/token", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "Refresh token is required." });
  }

  if (!refresh_tokens.includes(token)) {
    return res
      .status(403)
      .json({ error: "Invalid refresh token. Please login again." });
  }

  try {
    const user = jwt.verify(token, process.env.REFRESH_SECRET);
    const newAccessToken = genAccessToken({
      username: user.username,
      password: user.password,
    });
    return res.status(201).json({ access_token: newAccessToken });
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(403)
      .json({ error: "Invalid or expired token. Please login again." });
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
