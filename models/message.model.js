const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Number, required: true },
});

module.exports = mongoose.model("message", messageSchema);
