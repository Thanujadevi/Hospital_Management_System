const express = require('express');
const router = express.Router();
const { query, run } = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// GET /api/doctors
router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await query('SELECT doctor_id, name, specialization, phone, email, available_days FROM doctors');
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/doctors
router.post('/', verifyToken, authorizeRoles('Admin'), async (req, res) => {
    const { name, specialization, phone, email, available_days } = req.body;
    try {
        await run(
            'INSERT INTO doctors (name, specialization, phone, email, available_days) VALUES (?, ?, ?, ?, ?)',
            [name, specialization, phone, email, available_days]
        );
        res.json({ success: true, message: 'Doctor added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/doctors/:id
router.put('/:id', verifyToken, authorizeRoles('Admin'), async (req, res) => {
    const { name, specialization, phone, email, available_days } = req.body;
    try {
        await run(
            'UPDATE doctors SET name = ?, specialization = ?, phone = ?, email = ?, available_days = ? WHERE doctor_id = ?',
            [name, specialization, phone, email, available_days, req.params.id]
        );
        res.json({ success: true, message: 'Doctor updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/doctors/:id
router.delete('/:id', verifyToken, authorizeRoles('Admin'), async (req, res) => {
    try {
        await run('DELETE FROM doctors WHERE doctor_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Doctor deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
