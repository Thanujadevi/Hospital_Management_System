const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { db, run } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database initialization
async function initDB() {
    return new Promise((resolve, reject) => {
        console.log('Initializing SQLite database...');
        const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf-8');
        
        // SQLite needs queries to be run individually. We split by semicolon, but be careful with data that might contain semicolons.
        // For this schema, simple split is okay as long as we don't have semicolons in strings.
        const queries = schema.split(';').filter(q => q.trim() !== '');

        db.serialize(() => {
            queries.forEach(query => {
                db.run(query, (err) => {
                    if (err && !err.message.includes('already exists') && !err.message.includes('duplicate column')) {
                        console.error('Error running query:', query, err.message);
                    }
                });
            });
            console.log('Database initialized successfully.');
            resolve();
        });
    });
}

// Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const treatmentRoutes = require('./routes/treatments');
const medicineRoutes = require('./routes/medicines');
const prescriptionRoutes = require('./routes/prescriptions');
const billingRoutes = require('./routes/billing');
const reportRoutes = require('./routes/reports');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/reports', reportRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server after DB init
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
});
