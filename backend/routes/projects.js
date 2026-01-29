const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { uploadProject, cloudinary } = require("../middleware/upload");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new project
router.post("/", uploadProject.single("image"), async (req, res) => {
  try {
    console.log("📥 Request body:", req.body);
    console.log("📸 Request file:", req.file);

    const { name, description, location, price } = req.body;  

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const projectData = {
      name,
      description,
      image: req.file.path,
      imagePublicId: req.file.filename,
    };

  
    if (location) projectData.location = location;
    if (price) projectData.price = Number(price);

    console.log("💾 Creating project:", projectData);

    const project = new Project(projectData);
    const savedProject = await project.save();
    
    console.log("✅ Project saved:", savedProject._id);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("❌ Error creating project:", error);
    res.status(400).json({ message: error.message });
  }
});

// Update project
router.put("/:id", uploadProject.single("image"), async (req, res) => {
  try {
    const { name, description, location, price } = req.body;
    
    const updateData = {
      name,
      description,
    };

    if (location) updateData.location = location;
    if (price) updateData.price = Number(price);

    // If new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      const oldProject = await Project.findById(req.params.id);
      if (oldProject && oldProject.imagePublicId) {
        await cloudinary.uploader.destroy(oldProject.imagePublicId);
      }
      
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete image from Cloudinary
    if (project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
