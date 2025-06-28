import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import connectDatabase from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;

connectDatabase();

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
