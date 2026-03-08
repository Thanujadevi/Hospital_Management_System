const express = require('express');
const router = express.Router();
const { query, run, db } = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// GET /api/prescriptions
router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await query(`
            SELECT pr.*, p.name as patient_name, d.name as doctor_name, m.medicine_name 
            FROM prescriptions pr
            JOIN patients p ON pr.patient_id = p.patient_id
            JOIN doctors d ON pr.doctor_id = d.doctor_id
            JOIN medicines m ON pr.medicine_id = m.medicine_id
            ORDER BY pr.prescription_id DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/prescriptions - using manual transaction for SQLite
router.post('/', verifyToken, authorizeRoles('Admin', 'Doctor'), async (req, res) => {
    const { patient_id, doctor_id, medicine_id, dosage, duration } = req.body;

    db.serialize(async () => {
        try {
            db.run('BEGIN TRANSACTION');

            // 1. Create prescription
            db.run(
                'INSERT INTO prescriptions (patient_id, doctor_id, medicine_id, dosage, duration) VALUES (?, ?, ?, ?, ?)',
                [patient_id, doctor_id, medicine_id, dosage, duration]
            );

            // 2. Deduct stock
            db.run(
                'UPDATE medicines SET stock_quantity = stock_quantity - 1 WHERE medicine_id = ? AND stock_quantity > 0',
                [medicine_id]
            );

            db.run('COMMIT', (err) => {
                if (err) throw err;
                res.json({ success: true, message: 'Prescription created and stock updated' });
            });
        } catch (err) {
            db.run('ROLLBACK');
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error or insufficient stock' });
        }
    });
});

module.exports = router;
