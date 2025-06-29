import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import connectDatabase from "./db.js";
import setupSocket from "./socket.js";
import setupRoutes from "./routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "*",
    credentials: true,
  })
);
app.use(express.json());

const port = process.env.PORT || 8080;

connectDatabase();

const server = http.createServer(app);
setupSocket(server);
setupRoutes(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
