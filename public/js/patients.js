document.addEventListener('DOMContentLoaded', fetchPatients);

const modal = document.getElementById('patientModal');
const form = document.getElementById('patientForm');

async function fetchPatients() {
    try {
        const res = await fetch('/api/patients', { headers: getAuthHeader() });
        const result = await res.json();
        if (result.success) renderTable(result.data);
    } catch (err) { console.error(err); }
}

function renderTable(patients) {
    const tbody = document.getElementById('patients-table');
    tbody.innerHTML = patients.map(p => `
        <tr>
            <td>#${p.patient_id}</td>
            <td>${p.name}</td>
            <td>${p.age}</td>
            <td>${p.gender}</td>
            <td>${p.phone}</td>
            <td><span class="badge badge-scheduled">${p.blood_group}</span></td>
            <td>
                <button class="btn" style="width: auto; padding: 0.2rem 0.5rem; background: #5f6368;" onclick="editPatient(${JSON.stringify(p).replace(/"/g, '&quot;')})">Edit</button>
                <button class="btn" style="width: auto; padding: 0.2rem 0.5rem; background: var(--danger);" onclick="deletePatient(${p.patient_id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

document.getElementById('patientSearch').addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length < 2) return fetchPatients();
    try {
        const res = await fetch(`/api/patients/search?query=${query}`, { headers: getAuthHeader() });
        const result = await res.json();
        if (result.success) renderTable(result.data);
    } catch (err) { console.error(err); }
});

function openModal() {
    modal.style.display = 'block';
    form.reset();
    document.getElementById('patientId').value = '';
    document.getElementById('modalTitle').textContent = 'Register Patient';
}

function closeModal() {
    modal.style.display = 'none';
}

function editPatient(p) {
    openModal();
    document.getElementById('modalTitle').textContent = 'Update Patient';
    document.getElementById('patientId').value = p.patient_id;
    document.getElementById('patientName').value = p.name;
    document.getElementById('patientAge').value = p.age;
    document.getElementById('patientGender').value = p.gender;
    document.getElementById('patientPhone').value = p.phone;
    document.getElementById('patientBlood').value = p.blood_group;
    document.getElementById('patientAddress').value = p.address;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('patientId').value;
    const patientData = {
        name: document.getElementById('patientName').value,
        age: document.getElementById('patientAge').value,
        gender: document.getElementById('patientGender').value,
        phone: document.getElementById('patientPhone').value,
        blood_group: document.getElementById('patientBlood').value,
        address: document.getElementById('patientAddress').value
    };

    const url = id ? `/api/patients/${id}` : '/api/patients';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: getAuthHeader(),
            body: JSON.stringify(patientData)
        });
        const result = await res.json();
        if (result.success) {
            closeModal();
            fetchPatients();
        }
    } catch (err) { console.error(err); }
});

async function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    try {
        const res = await fetch(`/api/patients/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        const result = await res.json();
        if (result.success) fetchPatients();
    } catch (err) { console.error(err); }
}
