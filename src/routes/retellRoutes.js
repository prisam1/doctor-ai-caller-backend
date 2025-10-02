const express = require("express");
const router = express.Router();
const retellController = require("../controllers/retellController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/web-call", authMiddleware, retellController.createWebCall);
router.post("/retell-webhook", retellController.handleWebhook);

module.exports = router;
