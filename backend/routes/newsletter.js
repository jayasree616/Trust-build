const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");

// Get all newsletter subscriptions
router.get("/", async (req, res) => {
  try {
    const subscriptions = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Subscribe to newsletter
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const subscription = new Newsletter({ email });
    const savedSubscription = await subscription.save();

    res.status(201).json({
      message: "Successfully subscribed to newsletter",
      data: savedSubscription,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a subscription
router.delete("/:id", async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
