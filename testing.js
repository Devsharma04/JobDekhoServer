// import cluster from "cluster";
// import os, { availableParallelism } from "os";
// import express from "express";

// const CPUS = availableParallelism();
// const app = express();

// console.log(CPUS);

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < CPUS; i++) {
//     cluster.fork();
//   }
// } else {
//   app.get("/", (req, res) => {
//     const PID = process.pid;
//     res.send(`hello from worker ${PID}`);
//   });
//   app.listen(3000, () => {
//     console.log("listening on port 3000");
//   });

//   console.log(`Worker ${process.pid} started`);
// }

import fs from "fs";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Home = path.join(__dirname, "largefile.txt");

app.get("/", (req, res) => {
  const filestream = fs.createReadStream(Home);
  const zip = zlib.createGzip();

  //   filestream.on("data", (chunk) => {
  //     res.write(chunk);
  //   });

  //   filestream.on("end", () => {
  //     res.end();
  //   });
  //   filestream.on("error", (err) => {
  //     console.log(err);
  //   });
  //by express-----------------
  // filestream.pipe(zip).pipe(res);    used to zip file
  filestream.pipe(res);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

// for (let i = 0; i < 100000; i++) {
//   fs.appendFile("./largefile", "i am a large file for testing \n \n", () => {});
// }
