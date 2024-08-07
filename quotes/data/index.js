import { v4 as _id } from "uuid";
import { parse } from "csv-parse";
import fs from "fs";

const dataset = [];

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
          // console.log(dataset[1]);
        })
    );
  });
}

function addQuote(quote) {
  Object.assign(quote, {
    id: _id(),
  });
  dataset.push(quote);
  return quote;
}

export { loadQuotes, dataset as quotes, addQuote };
