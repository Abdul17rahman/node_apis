import { v4 as _id } from "uuid";
import { parse } from "csv-parse";
import fs from "fs";

let dataset = [];

let apiKeys = [];

let refreshTokens = [];

function loadQuotes() {
  return new Promise((resolve, reject) => {
    fs.createReadStream("./data/quotes_all.csv").pipe(
      parse({
        columns: true,
        delimiter: ";",
        skip_empty_lines: true,
        trim: true,
      })
        .on("data", (data) => {
          Object.assign(data, {
            id: _id(),
          });
          dataset.push(data);
        })
        .on("error", (err) => {
          console.log("Cant read data", err);
          reject(err);
        })
        .on("end", () => {
          console.log("Data succesfully loaded...", dataset.length);
          resolve();
        })
    );
  });
}

function getRandQuote() {
  const rand = Math.floor(Math.random() * dataset.length);
  return dataset[rand];
}

function quoteExists(_id) {
  return dataset.find(({ id }) => id === _id);
}

function addQuote(quote) {
  Object.assign(quote, {
    id: _id(),
  });
  dataset.push(quote);
  return quote;
}

function delQuote(id) {
  const toBeDeleted = quoteExists(id);
  if (toBeDeleted) {
    dataset = dataset.filter((q) => q.id !== id);
    return toBeDeleted;
  }
  return null;
}

function addToken(token) {
  refreshTokens.push(token);
}

function addKey(apikey) {
  apiKeys.push(apikey);
}

function checkToken(token) {
  return refreshTokens.includes(token);
}

function checkKey(key) {
  return apiKeys.includes(key);
}

export {
  loadQuotes,
  dataset as quotes,
  getRandQuote,
  addQuote,
  delQuote,
  quoteExists,
  addKey,
  checkKey,
  addToken,
  checkToken,
};
