const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

// ── CORS — only allow requests from the frontend origin
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// ── Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  }),
);
app.use(hpp());

// ── Body Parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── NoSQL Injection Sanitizer (Express 5 compatible)
app.use((req, _res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
    }
    return obj;
  };
  if (req.body) sanitize(req.body);
  if (req.headers) sanitize(req.headers);
  next();
});

// ── Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// ── Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ── Global Error Handler
app.use((err, _req, res, _next) => {
  const isProduction = process.env.NODE_ENV === "production";

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `This ${field} is already in use`,
      errors: [{ path: field, msg: `This ${field} is already in use` }],
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.entries(err.errors).map(([path, e]) => ({
      path,
      msg: e.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      isProduction && statusCode === 500 ? "Something went wrong" : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

module.exports = app;
