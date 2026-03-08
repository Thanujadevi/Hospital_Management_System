const express = require('express');
const router = express.Router();
const { query, run } = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// GET /api/treatments
router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await query(`
            SELECT t.*, p.name as patient_name, d.name as doctor_name 
            FROM treatments t
            JOIN patients p ON t.patient_id = p.patient_id
            JOIN doctors d ON t.doctor_id = d.doctor_id
            ORDER BY t.treatment_date DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/treatments
router.post('/', verifyToken, authorizeRoles('Admin', 'Doctor'), async (req, res) => {
    const { patient_id, doctor_id, diagnosis, treatment_description, treatment_date } = req.body;
    try {
        await run(
            'INSERT INTO treatments (patient_id, doctor_id, diagnosis, treatment_description, treatment_date) VALUES (?, ?, ?, ?, ?)',
            [patient_id, doctor_id, diagnosis, treatment_description, treatment_date]
        );
        res.json({ success: true, message: 'Treatment recorded' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
