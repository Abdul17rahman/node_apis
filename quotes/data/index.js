import { v4 as _id } from "uuid";
import { parse } from "csv-parse";
import fs from "fs";

const dataset = [];

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
    })
    .on("end", () => {
      console.log("Data succesfully loaded...");
      console.log(dataset[1]);
    })
);

export default dataset;
