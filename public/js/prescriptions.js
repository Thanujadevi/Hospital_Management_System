document.addEventListener('DOMContentLoaded', () => {
    fetchPrescriptions();
    loadDropdowns();
});

async function fetchPrescriptions() {
    try {
        const res = await fetch('/api/prescriptions', { headers: getAuthHeader() });
        const result = await res.json();
        if (result.success) renderTable(result.data);
    } catch (err) { console.error(err); }
}

function renderTable(data) {
    const tbody = document.getElementById('prescriptions-table');
    tbody.innerHTML = data.map(p => `
        <tr>
            <td>#${p.prescription_id}</td>
            <td>${p.patient_name}</td>
            <td>${p.doctor_name}</td>
            <td><span class="badge badge-scheduled">${p.medicine_name}</span></td>
            <td>${p.dosage}</td>
            <td>${p.duration}</td>
        </tr>
    `).join('');
}

async function loadDropdowns() {
    const pRes = await fetch('/api/patients', { headers: getAuthHeader() });
    const dRes = await fetch('/api/doctors', { headers: getAuthHeader() });
    const mRes = await fetch('/api/medicines', { headers: getAuthHeader() });
    
    const patients = await pRes.json();
    const doctors = await dRes.json();
    const medicines = await mRes.json();

    if (patients.success) {
        document.getElementById('patientId').innerHTML = patients.data.map(p => `<option value="${p.patient_id}">${p.name}</option>`).join('');
    }
    if (doctors.success) {
        document.getElementById('doctorId').innerHTML = doctors.data.map(d => `<option value="${d.doctor_id}">${d.name}</option>`).join('');
    }
    if (medicines.success) {
        document.getElementById('medicineId').innerHTML = medicines.data.map(m => `<option value="${m.medicine_id}">${m.medicine_name} (Stock: ${m.stock_quantity})</option>`).join('');
    }
}

function openModal() { document.getElementById('prescriptionModal').style.display = 'block'; }
function closeModal() { document.getElementById('prescriptionModal').style.display = 'none'; }

document.getElementById('prescriptionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        patient_id: document.getElementById('patientId').value,
        doctor_id: document.getElementById('doctorId').value,
        medicine_id: document.getElementById('medicineId').value,
        dosage: document.getElementById('dosage').value,
        duration: document.getElementById('duration').value
    };

    try {
        const res = await fetch('/api/prescriptions', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            closeModal();
            fetchPrescriptions();
        } else {
            alert(result.message);
        }
    } catch (err) { console.error(err); }
});
