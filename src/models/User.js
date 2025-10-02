const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    googleId: { type: String },
    //role: { type: String, default: 'doctor' },
    stripePaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
