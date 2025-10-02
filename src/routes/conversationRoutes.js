const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

router.post("/", conversationController.saveConversation);
router.get("/:patientId", conversationController.getConversationsByPatient);
router.get(
  "/detail/:id",
  conversationController.getSingleConversationsByPatient
);

module.exports = router;
