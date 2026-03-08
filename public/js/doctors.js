document.addEventListener('DOMContentLoaded', fetchDoctors);

const modal = document.getElementById('doctorModal');
const form = document.getElementById('doctorForm');
const user = getUser();

async function fetchDoctors() {
    try {
        const res = await fetch('/api/doctors', { headers: getAuthHeader() });
        const result = await res.json();
        if (result.success) renderTable(result.data);
    } catch (err) { console.error(err); }
}

function renderTable(doctors) {
    const tbody = document.getElementById('doctors-table');
    tbody.innerHTML = doctors.map(d => `
        <tr>
            <td>#${d.doctor_id}</td>
            <td>${d.name}</td>
            <td><span class="badge badge-scheduled">${d.specialization}</span></td>
            <td>${d.phone}</td>
            <td>${d.email}</td>
            <td>${d.available_days}</td>
            ${user.role === 'Admin' ? `
            <td>
                <button class="btn" style="width: auto; padding: 0.2rem 0.5rem; background: #5f6368;" onclick="editDoctor(${JSON.stringify(d).replace(/"/g, '&quot;')})">Edit</button>
                <button class="btn" style="width: auto; padding: 0.2rem 0.5rem; background: var(--danger);" onclick="deleteDoctor(${d.doctor_id})">Delete</button>
            </td>` : '<td>-</td>'}
        </tr>
    `).join('');
}

function openModal() {
    modal.style.display = 'block';
    form.reset();
    document.getElementById('doctorId').value = '';
    document.getElementById('modalTitle').textContent = 'Add Doctor';
}

function closeModal() {
    modal.style.display = 'none';
}

function editDoctor(d) {
    if (user.role !== 'Admin') return;
    openModal();
    document.getElementById('modalTitle').textContent = 'Update Doctor';
    document.getElementById('doctorId').value = d.doctor_id;
    document.getElementById('doctorName').value = d.name;
    document.getElementById('doctorSpecialization').value = d.specialization;
    document.getElementById('doctorPhone').value = d.phone;
    document.getElementById('doctorEmail').value = d.email;
    document.getElementById('doctorDays').value = d.available_days;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('doctorId').value;
    const doctorData = {
        name: document.getElementById('doctorName').value,
        specialization: document.getElementById('doctorSpecialization').value,
        phone: document.getElementById('doctorPhone').value,
        email: document.getElementById('doctorEmail').value,
        available_days: document.getElementById('doctorDays').value
    };

    const url = id ? `/api/doctors/${id}` : '/api/doctors';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: getAuthHeader(),
            body: JSON.stringify(doctorData)
        });
        const result = await res.json();
        if (result.success) {
            closeModal();
            fetchDoctors();
        }
    } catch (err) { console.error(err); }
});

async function deleteDoctor(id) {
    if (user.role !== 'Admin') return;
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    try {
        const res = await fetch(`/api/doctors/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        const result = await res.json();
        if (result.success) fetchDoctors();
    } catch (err) { console.error(err); }
}
