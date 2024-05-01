const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  venue: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  createdBy: { type: String, required: true }, // Created user name
  createdAt: { type: Date, default: Date.now }, // Created at time with default value
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
