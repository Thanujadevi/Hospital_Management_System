document.addEventListener('DOMContentLoaded', () => {
    fetchTreatments();
    loadDropdowns();
});

async function fetchTreatments() {
    try {
        const res = await fetch('/api/treatments', { headers: getAuthHeader() });
        const result = await res.json();
        if (result.success) renderTable(result.data);
    } catch (err) { console.error(err); }
}

function renderTable(data) {
    const tbody = document.getElementById('treatments-table');
    tbody.innerHTML = data.map(t => `
        <tr>
            <td>#${t.treatment_id}</td>
            <td>${t.patient_name}</td>
            <td>${t.doctor_name}</td>
            <td><span class="badge badge-scheduled">${t.diagnosis}</span></td>
            <td>${t.treatment_description}</td>
            <td>${new Date(t.treatment_date).toLocaleDateString()}</td>
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

function openModal() { document.getElementById('treatmentModal').style.display = 'block'; }
function closeModal() { document.getElementById('treatmentModal').style.display = 'none'; }

document.getElementById('treatmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        patient_id: document.getElementById('patientId').value,
        doctor_id: document.getElementById('doctorId').value,
        diagnosis: document.getElementById('diagnosis').value,
        treatment_description: document.getElementById('description').value,
        treatment_date: document.getElementById('treatmentDate').value
    };

    try {
        const res = await fetch('/api/treatments', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            closeModal();
            fetchTreatments();
        }
    } catch (err) { console.error(err); }
});
