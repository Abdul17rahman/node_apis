import http from "http";
import app from "./app.js";
import { loadQuotes } from "./data/index.js";

const server = http.createServer(app);
const PORT = 3000;

async function startServer() {
  await loadQuotes();
  server.listen(PORT, () => {
    console.log("Server running on PORT, ", PORT);
  });
}

startServer();
