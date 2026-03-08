const express = require('express');
const router = express.Router();
const { query, run } = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// GET /api/patients - List all patients
router.get('/', verifyToken, authorizeRoles('Admin', 'Receptionist'), async (req, res) => {
    try {
        const rows = await query('SELECT * FROM patients ORDER BY patient_id DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/patients/search
router.get('/search', verifyToken, authorizeRoles('Admin', 'Receptionist'), async (req, res) => {
    const { query: searchQuery } = req.query;
    try {
        const rows = await query(
            'SELECT * FROM patients WHERE name LIKE ? OR phone LIKE ?',
            [`%${searchQuery}%`, `%${searchQuery}%`]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/patients - Register
router.post('/', verifyToken, authorizeRoles('Admin', 'Receptionist'), async (req, res) => {
    const { name, age, gender, phone, address, blood_group } = req.body;
    try {
        const result = await run(
            'INSERT INTO patients (name, age, gender, phone, address, blood_group) VALUES (?, ?, ?, ?, ?, ?)',
            [name, age, gender, phone, address, blood_group]
        );
        res.json({ success: true, message: 'Patient registered', patientId: result.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/patients/:id - Update
router.put('/:id', verifyToken, authorizeRoles('Admin', 'Receptionist'), async (req, res) => {
    const { name, age, gender, phone, address, blood_group } = req.body;
    try {
        await run(
            'UPDATE patients SET name = ?, age = ?, gender = ?, phone = ?, address = ?, blood_group = ? WHERE patient_id = ?',
            [name, age, gender, phone, address, blood_group, req.params.id]
        );
        res.json({ success: true, message: 'Patient updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/patients/:id
router.delete('/:id', verifyToken, authorizeRoles('Admin'), async (req, res) => {
    try {
        await run('DELETE FROM patients WHERE patient_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Patient deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/patients/:id/history
router.get('/:id/history', verifyToken, authorizeRoles('Admin', 'Doctor', 'Receptionist'), async (req, res) => {
    try {
        const treatments = await query('SELECT * FROM treatments WHERE patient_id = ?', [req.params.id]);
        const appointments = await query('SELECT * FROM appointments WHERE patient_id = ?', [req.params.id]);
        res.json({ success: true, data: { treatments, appointments } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
