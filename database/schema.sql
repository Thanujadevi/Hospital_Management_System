-- SQLite Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('Admin', 'Doctor', 'Receptionist')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
    phone TEXT,
    address TEXT,
    blood_group TEXT,
    registration_date DATE DEFAULT (DATE('now'))
);

-- 3. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    specialization TEXT,
    phone TEXT,
    email TEXT,
    available_days TEXT
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    doctor_id INTEGER,
    appointment_date DATE,
    appointment_time TEXT,
    status TEXT CHECK(status IN ('Scheduled', 'Completed', 'Cancelled')) DEFAULT 'Scheduled',
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
);

-- 5. Treatments Table
CREATE TABLE IF NOT EXISTS treatments (
    treatment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    doctor_id INTEGER,
    diagnosis TEXT,
    treatment_description TEXT,
    treatment_date DATE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
);

-- 6. Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
    medicine_id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicine_name TEXT,
    price REAL,
    stock_quantity INTEGER
);

-- 7. Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    doctor_id INTEGER,
    medicine_id INTEGER,
    dosage TEXT,
    duration TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id) ON DELETE CASCADE
);

-- 8. Billing Table
-- SQLite doesn't support STORED generated columns in the same way, we'll calculate it in the query or use a simpler table.
CREATE TABLE IF NOT EXISTS billing (
    bill_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    treatment_cost REAL,
    medicine_cost REAL,
    total_amount REAL,
    bill_date DATE DEFAULT (DATE('now')),
    payment_status TEXT CHECK(payment_status IN ('Pending', 'Paid', 'Cancelled')) DEFAULT 'Pending',
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- Seed Data (Indian Names and Data)
-- Password for all: password123
INSERT OR REPLACE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@hms.com', '$2a$10$oIUVwhElH4Ncwi03A1wVVez.D80kCgX6Qg/Q/l9psq.g3wd3n7sRe', 'Admin'),
('Dr. Rahul Sharma', 'rahul@hms.com', '$2a$10$oIUVwhElH4Ncwi03A1wVVez.D80kCgX6Qg/Q/l9psq.g3wd3n7sRe', 'Doctor'),
('Dr. Anjali Gupta', 'anjali@hms.com', '$2a$10$oIUVwhElH4Ncwi03A1wVVez.D80kCgX6Qg/Q/l9psq.g3wd3n7sRe', 'Doctor'),
('Priya Singh', 'priya@hms.com', '$2a$10$oIUVwhElH4Ncwi03A1wVVez.D80kCgX6Qg/Q/l9psq.g3wd3n7sRe', 'Receptionist'),
('Suresh Kumar', 'suresh@hms.com', '$2a$10$oIUVwhElH4Ncwi03A1wVVez.D80kCgX6Qg/Q/l9psq.g3wd3n7sRe', 'Receptionist');

INSERT OR IGNORE INTO doctors (name, specialization, phone, email, available_days) VALUES
('Dr. Rahul Sharma', 'Cardiology', '9876543210', 'rahul@hms.com', 'Mon, Wed, Fri'),
('Dr. Anjali Gupta', 'Pediatrics', '9876543211', 'anjali@hms.com', 'Tue, Thu, Sat'),
('Dr. Vikram Mehta', 'Orthopedics', '9876543212', 'vikram@hms.com', 'Mon, Tue, Wed'),
('Dr. Sneha Reddy', 'Dermatology', '9876543213', 'sneha@hms.com', 'Wed, Thu, Fri'),
('Dr. Amit Patel', 'General Medicine', '9876543214', 'amit@hms.com', 'Mon to Sat');

INSERT OR IGNORE INTO patients (name, age, gender, phone, address, blood_group, registration_date) VALUES
('Rajesh Khanna', 45, 'Male', '9000000001', 'Mumbai, Maharashtra', 'O+', '2026-03-01'),
('Sunita Devi', 38, 'Female', '9000000002', 'Delhi, NCR', 'A+', '2026-03-02'),
('Amitabh Bachchan', 75, 'Male', '9000000003', 'Juhu, Mumbai', 'B+', '2026-03-03'),
('Deepika Padukone', 34, 'Female', '9000000004', 'Bangalore, Karnataka', 'O-', '2026-03-04'),
('Virat Kohli', 32, 'Male', '9000000005', 'Gurugram, Haryana', 'A-', '2026-03-05');

INSERT OR IGNORE INTO medicines (medicine_name, price, stock_quantity) VALUES
('Paracetamol 500mg', 20.00, 500),
('Amoxicillin 250mg', 150.00, 200),
('Metformin 500mg', 45.00, 300),
('Atorvastatin 10mg', 120.00, 150),
('Omeprazole 20mg', 80.00, 250);

INSERT OR IGNORE INTO billing (patient_id, treatment_cost, medicine_cost, total_amount, payment_status, bill_date) VALUES
(1, 500.00, 120.00, 620.00, 'Paid', '2026-03-05'),
(2, 300.00, 60.00, 360.00, 'Pending', '2026-03-06');
