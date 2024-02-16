const mongoose = require("mongoose");

const paymentTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity", // Reference to the Activity model
      required: true,
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
  paymentVerified: {
    type: Boolean,
    default: false,
  },
  paymentVerifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    default: null,
  },
});

const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  paymentTransactionSchema
);

module.exports = PaymentTransaction;
