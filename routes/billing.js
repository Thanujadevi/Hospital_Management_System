const express = require('express');
const router = express.Router();
const { query, run } = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// GET /api/billing
router.get('/', verifyToken, authorizeRoles('Admin', 'Receptionist'), async (req, res) => {
    try {
        const rows = await query(`
            SELECT b.*, p.name as patient_name 
            FROM billing b
            JOIN patients p ON b.patient_id = p.patient_id
            ORDER BY b.bill_date DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/billing
router.post('/', verifyToken, authorizeRoles('Admin', 'Receptionist'), async (req, res) => {
    const { patient_id, treatment_cost, medicine_cost } = req.body;
    const total_amount = parseFloat(treatment_cost) + parseFloat(medicine_cost);
    try {
        await run(
            'INSERT INTO billing (patient_id, treatment_cost, medicine_cost, total_amount) VALUES (?, ?, ?, ?)',
            [patient_id, treatment_cost, medicine_cost, total_amount]
        );
        res.json({ success: true, message: 'Bill generated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/billing/:id/status
router.put('/:id/status', verifyToken, authorizeRoles('Admin', 'Receptionist'), async (req, res) => {
    const { status } = req.body;
    try {
        await run('UPDATE billing SET payment_status = ? WHERE bill_id = ?', [status, req.params.id]);
        res.json({ success: true, message: 'Payment status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
