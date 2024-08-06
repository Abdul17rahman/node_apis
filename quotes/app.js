import express from "express";
import router from "./routes/index.v1.js";

const app = express();

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Welcome to my Quotes API");
});

export default app;
