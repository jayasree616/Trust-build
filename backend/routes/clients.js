const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const { uploadClient, cloudinary } = require("../middleware/upload");

// Get all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new client
router.post("/", uploadClient.single("image"), async (req, res) => {
  try {
    console.log("📥 Request body:", req.body);
    console.log("📸 Request file:", req.file);

    const { name, designation, testimonial } = req.body; // ✅ Changed 'description' to 'testimonial'

    // Validate required fields
    if (!name || !designation || !testimonial) {
      return res.status(400).json({
        message: "Name, designation, and testimonial are required",
        received: { name, designation, testimonial },
      });
    }

    const clientData = {
      name: name.trim(),
      designation: designation.trim(),
      testimonial: testimonial.trim(), // ✅ Using 'testimonial' now
    };

    // Add image if uploaded (optional now)
    if (req.file) {
      clientData.image = req.file.path;
      clientData.imagePublicId = req.file.filename;
      console.log("✅ Image uploaded:", req.file.path);
    }

    console.log("💾 Creating client with data:", clientData);

    const client = new Client(clientData);
    const savedClient = await client.save();

    console.log("✅ Client saved successfully:", savedClient._id);
    res.status(201).json(savedClient);
  } catch (error) {
    console.error("❌ Error creating client:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a client
router.delete("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (client.imagePublicId) {
      await cloudinary.uploader.destroy(client.imagePublicId);
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
