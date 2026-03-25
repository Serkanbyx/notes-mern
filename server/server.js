const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS — only allow requests from the frontend origin ─────────────
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ── Security Middleware ──────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(hpp());

// ── Body Parsers ────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── NoSQL Injection Sanitizer (Express 5 compatible) ────────────────
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

// ── Routes ───────────────────────────────────────────────────────────
// app.use("/api/auth", authRoutes);   — Adım 3'te eklenecek
// app.use("/api/notes", noteRoutes);  — Adım 4'te eklenecek

// ── Welcome Page ────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notes MERN API</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      overflow: hidden;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image:
        radial-gradient(circle, rgba(234,179,8,.06) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
    }

    body::after {
      content: "";
      position: fixed;
      top: 10%;
      left: 6%;
      width: 20px;
      height: 24px;
      border: 2px solid rgba(250,204,21,.2);
      border-radius: 3px;
      transform: rotate(-8deg);
      pointer-events: none;
      box-shadow:
        60vw 8vh 0 0 rgba(253,224,71,.15),
        20vw 65vh 0 0 rgba(250,204,21,.12),
        78vw 50vh 0 0 rgba(253,224,71,.10),
        40vw 25vh 0 0 rgba(250,204,21,.08),
        88vw 75vh 0 0 rgba(253,224,71,.12);
    }

    .container {
      position: relative;
      text-align: center;
      padding: 3rem 2.5rem;
      max-width: 460px;
      width: 90%;
      background: rgba(30,41,59,.7);
      border: 1px solid rgba(250,204,21,.15);
      border-radius: 20px;
      backdrop-filter: blur(12px);
      box-shadow:
        0 0 60px rgba(250,204,21,.04),
        0 25px 50px rgba(0,0,0,.35);
    }

    .icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 1.85rem;
      font-weight: 700;
      letter-spacing: -.02em;
      background: linear-gradient(135deg, #fde68a, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .divider {
      width: 48px;
      height: 2px;
      margin: 1.5rem auto;
      background: linear-gradient(90deg, transparent, #f59e0b, transparent);
      border-radius: 2px;
    }

    .status {
      font-size: .95rem;
      color: #94a3b8;
      line-height: 1.6;
    }

    .status strong {
      color: #fbbf24;
    }

    .sign {
      margin-top: 2rem;
      padding-top: 1.2rem;
      border-top: 1px solid rgba(250,204,21,.1);
      font-size: .78rem;
      color: #64748b;
    }
    .sign a {
      color: #fbbf24;
      text-decoration: none;
      transition: color .2s ease;
    }
    .sign a:hover { color: #fde68a; }

    @media (max-width: 480px) {
      .container { padding: 2rem 1.5rem; }
      h1 { font-size: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📝</div>
    <h1>Notes MERN API</h1>
    <div class="divider"></div>
    <p class="status">API is <strong>running</strong> and ready for requests.</p>
    <footer class="sign">
      Created by
      <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
      |
      <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
    </footer>
  </div>
</body>
</html>`);
});

// ── Global Error Handler ────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message: isProduction ? "Something went wrong" : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

// ── Start Server ────────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
