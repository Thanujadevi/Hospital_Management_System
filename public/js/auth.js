// Comprehensive Authentication Handler for LifeCare HMS

// 1. Initial Identity Check
const isAuthPage = document.body.getAttribute('data-auth') === 'login';

function checkAuth() {
    const token = localStorage.getItem('hms_token');
    
    // Safety check for file:// protocol which breaks localStorage sharing in some browsers
    if (window.location.protocol === 'file:') {
        console.error('ERROR: App must be run via "npm start" and accessed at http://localhost:3000');
        alert('CRITICAL: Please do not open HTML files directly. \n\n1. Go to your terminal.\n2. Run: npm start\n3. Open: http://localhost:3000');
        return;
    }

    if (!token) {
        // No token found - redirect to login if we are in the app
        if (!isAuthPage) {
            console.log('No token: Redirecting to Login');
            window.location.href = 'index.html';
        }
    } else {
        // Token exists - redirect to dashboard if we are on the login page
        if (isAuthPage) {
            console.log('Authenticated: Redirecting to Dashboard');
            window.location.href = 'dashboard.html';
        }
    }
}

// 2. Form Submission (Only on Login Page)
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('hms_token', result.data.token);
            localStorage.setItem('hms_user', JSON.stringify(result.data.user));
            window.location.replace('dashboard.html'); // Use replace to avoid back-button loops
        } else {
            errorMsg.textContent = result.message;
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        errorMsg.textContent = 'Connection error. Is the server running?';
        errorMsg.style.display = 'block';
    }
});

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem('hms_user')) || {};
    } catch (e) { return {}; }
}

function getAuthHeader() {
    return { 
        'Authorization': `Bearer ${localStorage.getItem('hms_token')}`, 
        'Content-Type': 'application/json' 
    };
}

// 3. Execution on Load
checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    if (user.role) {
        // Handle role-based UI restriction
        const restrictedElements = document.querySelectorAll('[data-role]');
        restrictedElements.forEach(el => {
            const allowedRoles = el.getAttribute('data-role').split(',');
            if (!allowedRoles.includes(user.role)) {
                el.style.display = 'none';
            }
        });
        
        const usernameEl = document.getElementById('username-display');
        if (usernameEl) usernameEl.textContent = user.name;
    }
});
