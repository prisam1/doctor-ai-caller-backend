// const { createWebCallSession } = require("../services/retellService");

// create web-call session (server-side, returns web call URL or token)
// exports.createWebCall = async (req, res) => {
//   try {
//     const { name, dob } = req.body;
//     const resp = await createWebCallSession(name, dob);
//     res.status(201).json(resp);
//   } catch (error) {
//     console.log("0-->", error);
//     res
//       .status(500)
//       .json({ error: error.message || "Failed to create Retell session" });
//   }
// };
 
const { createWebCallSession } = require("../services/retellService");
const Conversation = require("../models/Conversation");
const Patient = require("../models/Patient");  

exports.createWebCall = async (req, res) => {
  try {
    const { name, dob } = req.body;
 
    let patient = await Patient.findOne({ fullName: name, dob: new Date(dob) });

    if (!patient) {
         return res.status(404).json({
        error: "Patient not found. Please create a patient record first.",
      });
    }

    // Pass the patient's ID and other details to the AI service
    const resp = await createWebCallSession({
      patientId: patient._id,
      name,
      dob,
    });
    res.status(201).json(resp);
  } catch (error) {
    console.error("Failed to create Retell session:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create Retell session" });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const { event_type, transcript, metadata } = req.body;

    if (event_type === "call_ended" && metadata?.patientId) {
      const messages = transcript.map((t) => ({
        role: t.role === "agent" ? "ai" : "patient",
        content: t.content,
      }));

      const newConversation = new Conversation({
        patientId: metadata.patientId, // Use the ID from metadata
        messages,
      });
      await newConversation.save();
      console.log("Conversation saved successfully:", newConversation._id);
    }
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error handling Retell webhook:", error);
    res.status(500).send("Error");
  }
};
