document.addEventListener('DOMContentLoaded', () => {
    fetchBills();
    loadPatients();
});

async function fetchBills() {
    try {
        const res = await fetch('/api/billing', { headers: getAuthHeader() });
        const result = await res.json();
        if (result.success) renderTable(result.data);
    } catch (err) { console.error(err); }
}

function renderTable(data) {
    const tbody = document.getElementById('billing-table');
    tbody.innerHTML = data.map(b => `
        <tr>
            <td>#${b.bill_id}</td>
            <td>${b.patient_name}</td>
            <td>₹${parseFloat(b.treatment_cost).toLocaleString('en-IN')}</td>
            <td>₹${parseFloat(b.medicine_cost).toLocaleString('en-IN')}</td>
            <td><strong>₹${parseFloat(b.total_amount).toLocaleString('en-IN')}</strong></td>
            <td>${new Date(b.bill_date).toLocaleDateString()}</td>
            <td><span class="badge badge-${b.payment_status.toLowerCase()}">${b.payment_status}</span></td>
            <td>
                ${b.payment_status === 'Pending' ? `
                    <button class="btn" style="width: auto; padding: 0.2rem 0.5rem;" onclick="updatePayment(${b.bill_id}, 'Paid')">Mark Paid</button>
                ` : '-'}
            </td>
        </tr>
    `).join('');
}

async function loadPatients() {
    const res = await fetch('/api/patients', { headers: getAuthHeader() });
    const result = await res.json();
    if (result.success) {
        document.getElementById('patientId').innerHTML = result.data.map(p => `<option value="${p.patient_id}">${p.name}</option>`).join('');
    }
}

function openModal() { document.getElementById('billModal').style.display = 'block'; }
function closeModal() { document.getElementById('billModal').style.display = 'none'; }

document.getElementById('billForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        patient_id: document.getElementById('patientId').value,
        treatment_cost: document.getElementById('treatmentCost').value,
        medicine_cost: document.getElementById('medicineCost').value
    };

    try {
        const res = await fetch('/api/billing', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            closeModal();
            fetchBills();
        }
    } catch (err) { console.error(err); }
});

async function updatePayment(id, status) {
    try {
        await fetch(`/api/billing/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({ status })
        });
        fetchBills();
    } catch (err) { console.error(err); }
}
