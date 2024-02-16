const express = require("express");
const MessageModel = require("./../models/message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to handle user messages
router.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new MessageModel({ name, email, message });
    console.log(newMessage);
    await newMessage.save();

    res.status(201).json({ message: "Message submitted successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch all messages (requires admin access)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    // Check if the user's role is Admin
    if (req.user.role == "Admin" || req.user.role == "Manager") {
      const allMessages = await MessageModel.find();
      return res.json(allMessages);
    }
    return res.status(403).json({ message: "Permission denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a message by ID (with authentication middleware and role check)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Check if the user's role is Admin
    if (req.user.role == "Admin" || req.user.role == "Manager") {
      const messageId = req.params.id;

      // Validate if the message ID is valid
      if (!messageId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }

      // Find and delete the message
      const deletedMessage = await MessageModel.findByIdAndDelete(messageId);

      if (!deletedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }

      return res.json({ message: "Message deleted successfully" });
    }

    return res.status(403).json({ message: "Permission denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
