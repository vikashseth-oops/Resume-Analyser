const mongoose = require("mongoose");

// const AnalysisSchema = new mongoose.Schema(
  // {
    // fileName: { type: String, required: true },
    // targetRole: { type: String, required: true },
    // extractedSkills: [{ type: String }],
    // matchedSkills: [
      // {
        // skill: String,
        // level: String,
      // },
    // ],
    // missingSkills: [
      // {
        // skill: String,
        // level: String,
      // },
    // ],
    // roleFitScore: { type: Number, required: true },
    // roadmap: [
      // {
        // skill: String,
        // priority: String,
        // resources: [
          // {
            // title: String,
            // type: String,
            // provider: String,
          // },
        // ],
      // },
    // ],
  // },
  // { timestamps: true }   
// 
// );
// console.log(AnalysisSchema.obj.roadmap[0].resources);

const ResourceSchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    provider: String,
  },
  { _id: false }
);

const RoadmapSchema = new mongoose.Schema(
  {
    skill: String,
    priority: String,
    resources: [ResourceSchema],
  },
  { _id: false }
);

const AnalysisSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    targetRole: { type: String, required: true },
    extractedSkills: [String],
    matchedSkills: [
      {
        skill: String,
        level: String,
      },
    ],
    missingSkills: [
      {
        skill: String,
        level: String,
      },
    ],
    roleFitScore: Number,
    roadmap: [RoadmapSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", AnalysisSchema);
