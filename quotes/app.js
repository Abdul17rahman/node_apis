import express from "express";
import router from "./routes/index.v1.js";
import session from "express-session";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  session({
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 },
  })
);

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Welcome to my Quotes API");
});

export default app;
