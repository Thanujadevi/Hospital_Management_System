const express = require('express');
const router = express.Router();
const { query, run } = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// GET /api/medicines
router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await query('SELECT * FROM medicines');
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/medicines
router.post('/', verifyToken, authorizeRoles('Admin'), async (req, res) => {
    const { medicine_name, price, stock_quantity } = req.body;
    try {
        await run(
            'INSERT INTO medicines (medicine_name, price, stock_quantity) VALUES (?, ?, ?)',
            [medicine_name, price, stock_quantity]
        );
        res.json({ success: true, message: 'Medicine added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/medicines/:id
router.put('/:id', verifyToken, authorizeRoles('Admin', 'Receptionist'), async (req, res) => {
    const { stock_quantity } = req.body;
    try {
        await run('UPDATE medicines SET stock_quantity = ? WHERE medicine_id = ?', [stock_quantity, req.params.id]);
        res.json({ success: true, message: 'Stock updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
