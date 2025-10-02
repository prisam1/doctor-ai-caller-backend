const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["ai", "patient"],
    required: true,
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
