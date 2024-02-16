// Import necessary modules and models
const express = require("express");
const router = express.Router();
const PaymentTransaction = require("../models/paymentVerification");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

// Create Payment Transaction
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { activities } = req.body;
    const userId = req.user._id;

    // Create a new payment transaction
    const newPaymentTransaction = new PaymentTransaction({
      user: userId,
      activities,
    });

    await newPaymentTransaction.save();

    const user = await User.findById(userId);
    user.registeredActivities = [];
    await user.save();

    res
      .status(201)
      .json({ message: "Payment transaction created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify or Unverify Payment Transaction
router.put("/verify/:transactionId", authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const verifierId = req.user._id;

    // Find the payment transaction by ID
    const paymentTransaction = await PaymentTransaction.findById(transactionId);

    if (!paymentTransaction) {
      return res.status(404).json({ message: "Payment transaction not found" });
    }

    // Toggle payment verification status
    paymentTransaction.paymentVerified = !paymentTransaction.paymentVerified;
    paymentTransaction.paymentVerifiedBy = paymentTransaction.paymentVerified
      ? verifierId
      : null;

    await paymentTransaction.save();

    res.json({
      message: `Payment transaction ${
        paymentTransaction.paymentVerified ? "verified" : "unverified"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Payment Transactions with User and Verifier Data
router.get("/all", authMiddleware, async (req, res) => {
  try {
    // Check if the user's role is Admin or Manager
    if (req.user.role === "Admin" || req.user.role === "Manager") {
      // Fetch all payment transactions and populate user and verifier details
      const allPayments = await PaymentTransaction.find()
        .populate({
          path: "activities",
          select: "name date price",
        })
        .populate("user", "name email _id")
        .populate("paymentVerifiedBy", "name email _id");

      return res.json(allPayments);
    }

    return res.status(403).json({ message: "Permission denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Payment History of the Logged-in User
router.get("/history", authMiddleware, async (req, res) => {
  try {
    // Fetch payment transactions for the logged-in user
    const userPayments = await PaymentTransaction.find({ user: req.user._id })
      .populate({
        path: "activities",
        select: "name date price",
      })
      .populate("paymentVerifiedBy", "name email _id")
      .exec();

    res.json(userPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
