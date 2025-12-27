const express = require("express");
const router = express.Router();
const Project = require("../models/project");

// GET all project descriptions
// Usage: GET /api/projects/description
router.get("/description", async (req, res) => {
  try {
    const projects = await Project.find().select("name description");
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all project statuses
// Usage: GET /api/projects/status
router.get("/status", async (req, res) => {
  try {
    const projects = await Project.find().select("name status");
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;