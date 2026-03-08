document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/reports', {
            headers: getAuthHeader()
        });
        const result = await response.json();

        if (result.success) {
            const { summary, dailyRegistrations, monthlyRevenue, doctorWorkload, appointmentStats } = result.data;

            // Update Stats
            document.getElementById('stat-patients').textContent = summary.total_patients;
            document.getElementById('stat-doctors').textContent = summary.total_doctors;
            document.getElementById('stat-appointments').textContent = summary.today_appointments;
            document.getElementById('stat-revenue').textContent = `₹${parseFloat(summary.total_revenue).toLocaleString('en-IN')}`;

            // Revenue Chart
            new Chart(document.getElementById('revenueChart'), {
                type: 'line',
                data: {
                    labels: monthlyRevenue.map(item => item.label),
                    datasets: [{
                        label: 'Revenue (₹)',
                        data: monthlyRevenue.map(item => item.value),
                        borderColor: '#1a73e8',
                        tension: 0.1,
                        fill: true,
                        backgroundColor: 'rgba(26, 115, 232, 0.1)'
                    }]
                }
            });

            // Status Chart
            new Chart(document.getElementById('statusChart'), {
                type: 'doughnut',
                data: {
                    labels: appointmentStats.map(item => item.label),
                    datasets: [{
                        data: appointmentStats.map(item => item.value),
                        backgroundColor: ['#1a73e8', '#34a853', '#ea4335']
                    }]
                }
            });
        }

        // Fetch Recent Patients
        const patientRes = await fetch('/api/patients', { headers: getAuthHeader() });
        const patientData = await patientRes.json();
        if (patientData.success) {
            const tbody = document.getElementById('recent-patients-table');
            tbody.innerHTML = patientData.data.slice(0, 5).map(p => `
                <tr>
                    <td>#${p.patient_id}</td>
                    <td>${p.name}</td>
                    <td>${p.age}</td>
                    <td>${p.gender}</td>
                    <td>${new Date(p.registration_date).toLocaleDateString()}</td>
                </tr>
            `).join('');
        }

    } catch (err) {
        console.error(err);
    }
});
