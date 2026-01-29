const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// CORS - ALLOW ALL VERCEL PREVIEW URLS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      /^https:\/\/real-trust-.*\.vercel\.app$/, // All Vercel preview URLs
      process.env.FRONTEND_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes - FIXED FILE NAMES
app.use("/api/projects", require("./routes/projects")); // Changed
app.use("/api/clients", require("./routes/clients")); // Changed
app.use("/api/contacts", require("./routes/contacts")); // Changed
app.use("/api/newsletter", require("./routes/newsletter")); // Changed

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Real Trust API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
