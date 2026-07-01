const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { extractText } = require("../utils/resumeParser");
const { extractSkillsFromText, analyzeAgainstRole, getAllRoles } = require("../utils/skillMatcher");
const Analysis = require("../models/Analysis");



const router = express.Router();

// --- multer setup: temp storage for uploaded resumes ---
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".docx", ".txt"];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error("Only .pdf, .docx, and .txt files are supported"));
  },
});

// GET /api/roles -> list of supported job roles
router.get("/roles", (req, res) => {
  res.json({ roles: getAllRoles() });
});

// POST /api/analyze -> upload resume + targetRole, get full skill-gap report
router.post("/analyze", upload.single("resume"), async (req, res) => {
  let filePath;
  try {
    const { targetRole } = req.body;
    if (!req.file) return res.status(400).json({ error: "No resume file uploaded" });
    if (!targetRole) return res.status(400).json({ error: "targetRole is required" });

    filePath = req.file.path;

    const rawText = await extractText(filePath, req.file.originalname);
    const extractedSkills = extractSkillsFromText(rawText);
    const result = analyzeAgainstRole(extractedSkills, targetRole);



    let savedId = null;
    // Persist to MongoDB if connected; analysis still works without DB

    if (require("mongoose").connection.readyState === 1) {
      const doc = await Analysis.create({
      fileName: req.file.originalname,
      targetRole,
      extractedSkills,
      matchedSkills: result.matched,
      missingSkills: result.missing,
      roleFitScore: result.score,
      roadmap: result.roadmap,
      });
      savedId = doc._id;
      // console.dir(result.roadmap, { depth: null });

      // return res.json({
        // roadmap: result.roadmap,
      // });
    }

    res.json({
      id: savedId,
      fileName: req.file.originalname,
      extractedSkillsCount: extractedSkills.length,
      extractedSkills,
      ...result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to analyze resume" });
  } finally {
    // cleanup temp file
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

// GET /api/history -> previous analyses (requires MongoDB)
router.get("/history", async (req, res) => {
  try {
    if (require("mongoose").connection.readyState !== 1) {
      return res.json({ history: [], note: "MongoDB not connected; history unavailable" });
    }
    const history = await Analysis.find().sort({ createdAt: -1 }).limit(20);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
