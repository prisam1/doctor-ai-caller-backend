const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, patientController.createPatient);
router.get('/', authMiddleware, patientController.getPatients);
router.get('/:id', authMiddleware, patientController.getPatientById);

module.exports = router;
