const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Get all contact form submissions
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new contact form submission
router.post("/", async (req, res) => {
  try {
    console.log("📥 Contact form data:", req.body);

    const { name, email, message } = req.body; // ✅ Updated field names

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
        received: { name, email, message },
      });
    }

    const contact = new Contact({
      name, // ✅ Updated
      email,
      message, // ✅ Updated
    });

    const savedContact = await contact.save();

    console.log("✅ Contact saved:", savedContact._id);

    res.status(201).json({
      message: "Contact form submitted successfully",
      data: savedContact,
    });
  } catch (error) {
    console.error("❌ Error saving contact:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a contact
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
