const mongoose = require("mongoose");

const MedicalHistorySchema = new mongoose.Schema(
  {
    title: { type: String },
    notes: { type: String },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PatientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String  },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    medicalIssue: { type: String, required: true },
    medicalHistory: [MedicalHistorySchema],
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
