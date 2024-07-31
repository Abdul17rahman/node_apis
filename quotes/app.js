import express from "express";
import dataset from "./data/index.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Data is loaded");
});

export default app;
