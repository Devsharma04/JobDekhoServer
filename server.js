import express from "express";
import cors from "cors";
import dbConnect from "./Database/db.connection.js";
import dotenv from "dotenv";
import { routes } from "./Routes/user.routes.js";
import cookieParser from "cookie-parser";

// port info---------------
dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();

//db connection and port listen -----IIFE function()()--------------

(async () => {
  await dbConnect();
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
})();

// ------------------------------------------------

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Allow requests from this origin
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type"); // Allow these headers in requests
  res.setHeader("Access-Control-Expose-Headers", "Authorization"); // Expose these headers in responses
  next(); // Pass control to the next middleware
});
// api routes middleware=========================================
app.use("/api", routes);

app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "something went wrong";
  console.log(
    `app failed with status code ${statuscode} and message ${message}`
  );
});
