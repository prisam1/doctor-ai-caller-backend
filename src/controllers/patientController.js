const Patient = require("../models/Patient");

exports.createPatient = async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };
  try { 
    const patient = await Patient.create(payload);  
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const { 
      q,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { createdBy: req.user._id };

    if (q) {
      const re = new RegExp(q, "i");
      filter.$or = [
        { fullName: re },
        { phone: re },
        { email: re },
        { medicalIssue: re },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const patients = await Patient.find(filter)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await Patient.countDocuments(filter);
    res.status(200).json({ patients, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  const p = await Patient.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
};
