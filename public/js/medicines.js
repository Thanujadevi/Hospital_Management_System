document.addEventListener('DOMContentLoaded', fetchMedicines);

const modal = document.getElementById('medicineModal');
const form = document.getElementById('medicineForm');

async function fetchMedicines() {
    try {
        const res = await fetch('/api/medicines', { headers: getAuthHeader() });
        const result = await res.json();
        if (result.success) renderTable(result.data);
    } catch (err) { console.error(err); }
}

function renderTable(data) {
    const tbody = document.getElementById('medicines-table');
    tbody.innerHTML = data.map(m => `
        <tr>
            <td>#${m.medicine_id}</td>
            <td>${m.medicine_name}</td>
            <td>₹${parseFloat(m.price).toLocaleString('en-IN')}</td>
            <td>${m.stock_quantity}</td>
            <td>
                <span class="badge badge-${m.stock_quantity > 20 ? 'completed' : 'cancelled'}">
                    ${m.stock_quantity > 20 ? 'In Stock' : 'Low Stock'}
                </span>
            </td>
            <td>
                <button class="btn" style="width: auto; padding: 0.2rem 0.5rem; background: #5f6368;" onclick="updateStock(${m.medicine_id})">Update Stock</button>
            </td>
        </tr>
    `).join('');
}

function openModal() { modal.style.display = 'block'; }
function closeModal() { modal.style.display = 'none'; }

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        medicine_name: document.getElementById('medicineName').value,
        price: document.getElementById('medicinePrice').value,
        stock_quantity: document.getElementById('medicineStock').value
    };

    try {
        const res = await fetch('/api/medicines', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            closeModal();
            fetchMedicines();
        }
    } catch (err) { console.error(err); }
});

async function updateStock(id) {
    const newStock = prompt('Enter new stock quantity:');
    if (newStock === null) return;
    try {
        await fetch(`/api/medicines/${id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({ stock_quantity: newStock })
        });
        fetchMedicines();
    } catch (err) { console.error(err); }
}
