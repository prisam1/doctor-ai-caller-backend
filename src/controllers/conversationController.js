const Conversation = require("../models/Conversation");
const Patient = require("../models/Patient");

exports.saveConversation = async (req, res) => {
  try {
    const { patientId, messages } = req.body;

    if (!patientId || !messages) {
      return res
        .status(400)
        .json({ error: "patientId and messages are required" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const conversation = new Conversation({
      patient: patientId,
      messages,
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getConversationsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const conversations = await Conversation.find({ patientId }).sort({
      createdAt: -1,
    });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSingleConversationsByPatient = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
