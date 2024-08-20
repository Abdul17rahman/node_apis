import { findUser } from "./data/users.js";
import { checkKey } from "./data/index.js";
import jwt from "jsonwebtoken";

function basicAuth(req, res, next) {
  // Check if authorization headers exist
  if (!req.headers.authorization) {
    return res.status(400).json({ error: "You're not authorized." });
  }
  const [type, authCredentials] = req.headers.authorization.split(" ") || "";

  // Check if credentials are correctly formarted
  if (type !== "Basic" || !authCredentials) {
    return res.status(400).json({ error: "Malformed authorization header." });
  }
  const [username, password] = Buffer.from(authCredentials, "base64")
    .toString()
    .split(":");

  const user = findUser(username);
  if (!user) {
    return res.status(401).json({ error: "Please register." });
  }
  if (password !== Buffer.from(user.password, "base64").toString("ascii")) {
    return res.status(403).json({ error: "Invalid credentials." });
  }
  req.user = user.id;
  next();
}

function tokenAuth(req, res, next) {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ error: "Not authorized, token expired or missing" });
  }

  try {
    const authenticated = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = authenticated.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
}

function apikeyAuth(req, res, next) {
  const { apiKey } = req.query;
  if (!checkKey(apiKey)) {
    return res.status(403).json({
      error: "API key is required.!",
    });
  }
  next();
}

export { tokenAuth, apikeyAuth, basicAuth };
