require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const analyzeRoutes = require("./routes/analyze");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      process.env.FRONTEND_URL // Vercel URL
    ],
    credentials: true,
  })
);
app.use(express.json());



app.use("/api", analyzeRoutes);

app.get("/api/health", (req, res) => {   
  res.json({
    status: "ok",
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

// Connect to MongoDB (non-blocking: server still serves the analysis API
// using in-memory results even if MongoDB is unreachable, history just won't persist)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.warn("MongoDB not connected (history disabled):", err.message));

app.listen(PORT, () => {
  console.log(`Resume Analyzer API running on port ${PORT}`);
});
