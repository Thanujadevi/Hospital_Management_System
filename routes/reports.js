const express = require('express');
const router = express.Router();
const { query, get } = require('../config/db');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// GET /api/reports
router.get('/', verifyToken, authorizeRoles('Admin'), async (req, res) => {
    try {
        // 1. Daily patient registrations
        const dailyRegistrations = await query(`
            SELECT registration_date as label, COUNT(*) as value 
            FROM patients 
            WHERE registration_date >= DATE('now', '-30 days')
            GROUP BY registration_date 
            ORDER BY registration_date ASC
        `);

        // 2. Monthly revenue totals
        const monthlyRevenue = await query(`
            SELECT strftime('%Y-%m', bill_date) as label, SUM(total_amount) as value 
            FROM billing 
            WHERE payment_status = 'Paid'
            GROUP BY label 
            ORDER BY label ASC
        `);

        // 3. Doctor workload
        const doctorWorkload = await query(`
            SELECT d.name as label, COUNT(a.appointment_id) as value 
            FROM doctors d
            LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
            GROUP BY d.doctor_id
        `);

        // 4. Appointment statistics
        const appointmentStats = await query(`
            SELECT status as label, COUNT(*) as value 
            FROM appointments 
            GROUP BY status
        `);

        // 5. Overall Stats
        const { total_patients } = await get('SELECT COUNT(*) as total_patients FROM patients');
        const { total_doctors } = await get('SELECT COUNT(*) as total_doctors FROM doctors');
        const { today_appointments } = await get("SELECT COUNT(*) as today_appointments FROM appointments WHERE appointment_date = DATE('now')");
        const { total_revenue } = await get('SELECT IFNULL(SUM(total_amount), 0) as total_revenue FROM billing WHERE payment_status = "Paid"');

        res.json({
            success: true,
            data: {
                dailyRegistrations,
                monthlyRevenue,
                doctorWorkload,
                appointmentStats,
                summary: {
                    total_patients,
                    total_doctors,
                    today_appointments,
                    total_revenue
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
