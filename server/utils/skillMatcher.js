const jobRoles = require("../data/jobRoles.json");
const learningResources = require("../data/learningResources.json");

/** Normalize text: lowercase, collapse whitespace, strip punctuation noise */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s+./#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Build a flat, de-duplicated master skill list across all known roles */
function getMasterSkillList() {
  const set = new Set();
  Object.values(jobRoles).forEach((levels) => {
    Object.values(levels).forEach((arr) => arr.forEach((s) => set.add(s)));
  });
  return Array.from(set);
}

/**
 * Keyword-based skill extraction.
 * Looks for each known skill phrase as a whole-word/phrase match inside the resume text,
 * plus handles common synonym variants.
 */
const SYNONYMS = {
  "js": "javascript",
  "reactjs": "react",
  "react.js": "react",
  "nodejs": "node.js",
  "node": "node.js",
  "expressjs": "express",
  "mongo": "mongodb",
  "ts": "typescript",
  "postgres": "sql",
  "postgresql": "sql",
  "mysql": "sql",
  "k8s": "kubernetes",
  "amazon web services": "aws",
  "ml": "machine learning",
  "rest apis": "rest api",
  "restful api": "rest api",
  "restful apis": "rest api",
  "ci cd": "ci/cd",
  "cicd": "ci/cd",
};

function extractSkillsFromText(rawText) {
  const text = normalize(rawText);
  const masterSkills = getMasterSkillList();
  const found = new Set();

  // direct phrase matching against master skill list
  masterSkills.forEach((skill) => {
    const pattern = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i");
    if (pattern.test(text)) found.add(skill);
  });

  // synonym matching
  Object.entries(SYNONYMS).forEach(([syn, canonical]) => {
    const pattern = new RegExp(`\\b${escapeRegex(syn)}\\b`, "i");
    if (pattern.test(text)) found.add(canonical);
  });

  return Array.from(found);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Computes role-fit score and skill-gap report for a given target job role.
 */
function analyzeAgainstRole(resumeSkills, roleName) {
  const role = jobRoles[roleName];
  if (!role) throw new Error(`Unknown job role: ${roleName}`);

  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));

  const weights = { core: 3, intermediate: 2, advanced: 1 };
  let totalWeight = 0;
  let matchedWeight = 0;
  const matched = [];
  const missing = [];

  Object.entries(role).forEach(([level, skills]) => {
    skills.forEach((skill) => {
      totalWeight += weights[level];
      if (resumeSet.has(skill.toLowerCase())) {
        matchedWeight += weights[level];
        matched.push({ skill, level });
      } else {
        missing.push({ skill, level });
      }
    });
  });

  const score = Math.round((matchedWeight / totalWeight) * 100);

  const roadmap = missing
    .sort((a, b) => {
      const order = { core: 0, intermediate: 1, advanced: 2 };
      return order[a.level] - order[b.level];
    })
    .map((item) => ({
      skill: item.skill,
      priority: item.level,
      resources: learningResources[item.skill] || learningResources["default"],
    }));

  return {
    role: roleName,
    score,
    matched,
    missing,
    missingCount: missing.length,
    roadmap,
  };
}

function getAllRoles() {
  return Object.keys(jobRoles);
}

module.exports = {
  extractSkillsFromText,
  analyzeAgainstRole,
  getAllRoles,
  normalize,
};
