import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConn from "./config/DBconnect.js";
import V1Router from "./versions/V1.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

const CorsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  exposedHeaders: "Authorization",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
};

// Middleware
app.set("trust proxy", true);
app.use(cors(CorsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
dbConn();

// Serve static files from 'dist'
app.use(express.static(path.join(__dirname, "dist")));

// API Routes
app.use("/api/v1", V1Router);

// Serve frontend for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on port ${PORT}`)
);
