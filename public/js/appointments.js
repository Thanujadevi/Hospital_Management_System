document.addEventListener('DOMContentLoaded', () => {
    fetchAppointments();
    loadDropdowns();
});

async function fetchAppointments() {
    try {
        const res = await fetch('/api/appointments', { headers: getAuthHeader() });
        const result = await res.json();
        if (result.success) renderTable(result.data);
    } catch (err) { console.error(err); }
}

function renderTable(appointments) {
    const tbody = document.getElementById('appointments-table');
    tbody.innerHTML = appointments.map(a => `
        <tr>
            <td>#${a.appointment_id}</td>
            <td>${a.patient_name}</td>
            <td>${a.doctor_name}</td>
            <td>${new Date(a.appointment_date).toLocaleDateString()}</td>
            <td>${a.appointment_time}</td>
            <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
            <td>
                <select onchange="updateStatus(${a.appointment_id}, this.value)" style="padding: 0.2rem; border-radius: 4px;">
                    <option value="Scheduled" ${a.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                    <option value="Completed" ${a.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${a.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        </tr>
    `).join('');
}

async function loadDropdowns() {
    const pRes = await fetch('/api/patients', { headers: getAuthHeader() });
    const dRes = await fetch('/api/doctors', { headers: getAuthHeader() });
    const patients = await pRes.json();
    const doctors = await dRes.json();

    if (patients.success) {
        document.getElementById('patientId').innerHTML = patients.data.map(p => `<option value="${p.patient_id}">${p.name}</option>`).join('');
    }
    if (doctors.success) {
        document.getElementById('doctorId').innerHTML = doctors.data.map(d => `<option value="${d.doctor_id}">${d.name}</option>`).join('');
    }
}

function openModal() { document.getElementById('appointmentModal').style.display = 'block'; }
function closeModal() { document.getElementById('appointmentModal').style.display = 'none'; }

document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        patient_id: document.getElementById('patientId').value,
        doctor_id: document.getElementById('doctorId').value,
        appointment_date: document.getElementById('appointmentDate').value,
        appointment_time: document.getElementById('appointmentTime').value
    };

    try {
        const res = await fetch('/api/appointments', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            closeModal();
            fetchAppointments();
        }
    } catch (err) { console.error(err); }
});

async function updateStatus(id, status) {
    try {
        await fetch(`/api/appointments/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({ status })
        });
        fetchAppointments();
    } catch (err) { console.error(err); }
}
