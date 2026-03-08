const express = require('express');
const router = express.Router();
const { query, run } = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// GET /api/appointments
router.get('/', verifyToken, async (req, res) => {
    try {
        let sql = `
            SELECT a.*, p.name as patient_name, d.name as doctor_name 
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            JOIN doctors d ON a.doctor_id = d.doctor_id
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `;
        let params = [];

        if (req.user.role === 'Doctor') {
            sql = `
                SELECT a.*, p.name as patient_name, d.name as doctor_name 
                FROM appointments a
                JOIN patients p ON a.patient_id = p.patient_id
                JOIN doctors d ON a.doctor_id = d.doctor_id
                WHERE d.name = ?
                ORDER BY a.appointment_date DESC, a.appointment_time DESC
            `;
            params = [req.user.name];
        }

        const rows = await query(sql, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/appointments
router.post('/', verifyToken, authorizeRoles('Admin', 'Receptionist'), async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;
    try {
        await run(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)',
            [patient_id, doctor_id, appointment_date, appointment_time]
        );
        res.json({ success: true, message: 'Appointment scheduled' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/appointments/:id/status
router.put('/:id/status', verifyToken, async (req, res) => {
    const { status } = req.body;
    try {
        await run('UPDATE appointments SET status = ? WHERE appointment_id = ?', [status, req.params.id]);
        res.json({ success: true, message: 'Status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/appointments/:id
router.delete('/:id', verifyToken, authorizeRoles('Admin', 'Receptionist'), async (req, res) => {
    try {
        await run('DELETE FROM appointments WHERE appointment_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Appointment cancelled' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
