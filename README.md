# LifeCare Hospital Management System 🏥

A comprehensive, full-stack Hospital Management System (HMS) built to manage hospital operations efficiently. This system provides a unified interface for Admins, Doctors, and Receptionists to handle patient data, appointments, medical records, and billing.

## 🚀 Features

-   **Authentication & Role-Based Access**: Secure login system with specific access levels for Admins, Doctors, and Receptionists.
-   **Patient Management**: Register new patients, maintain detailed medical histories, and search patient records.
-   **Doctor Scheduling**: Manage doctor profiles and availability.
-   **Appointment Management**: Schedule and track patient appointments with status updates (Scheduled, Completed, Cancelled).
-   **Treatments & Prescriptions**: Doctors can record treatments and issue digital prescriptions.
-   **Pharmacy/Medicine Inventory**: Track available medicines and their distribution.
-   **Billing & Invoicing**: Automated billing system for procedures and medicines.
-   **Analytical Dashboard**: Real-time stats on total patients, doctors, revenue, and appointment trends using Chart.js.

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: SQLite3 (Self-contained, no external DB setup required)
-   **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
-   **Security**: JWT (JSON Web Tokens) for session management, Bcrypt for password hashing.
-   **Visualization**: Chart.js for dashboard analytics.

## ⚙️ Installation & Setup

### Prerequisites
-   Node.js installed on your machine.

### Steps
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Thanujadevi/Hospital_Management_System.git
    cd Hospital_Management_System/hospital-management
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    JWT_SECRET=your_super_secret_key
    ```

4.  **Run the Application**
    ```bash
    # For Production
    npm start

    # For Development (with nodemon)
    npm run dev
    ```

5.  **Access the Web Interface**
    Open your browser and navigate to `http://localhost:3000`

## 📂 Project Structure

```text
├── config/             # Database connection setup
├── database/           # SQL schema and seed data
├── middleware/         # Auth and error handling
├── public/             # Frontend assets (HTML, CSS, JS)
├── routes/             # API endpoints
├── server.js           # Server entry point
└── hospital.db         # SQLite database file (generated on start)
```

## 📝 License
This project is for educational purposes. 

---
Developed with ❤️ for LifeCare HMS.
