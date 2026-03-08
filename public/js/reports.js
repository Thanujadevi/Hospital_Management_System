document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/reports', { headers: getAuthHeader() });
        const result = await response.json();

        if (result.success) {
            const { summary, dailyRegistrations, monthlyRevenue, doctorWorkload, appointmentStats } = result.data;

            // Summary
            document.getElementById('report-revenue').textContent = `₹${parseFloat(summary.total_revenue).toLocaleString('en-IN')}`;
            document.getElementById('report-patients').textContent = summary.total_patients;
            document.getElementById('report-doctors').textContent = summary.total_doctors;

            // Registrations Chart
            new Chart(document.getElementById('regChart'), {
                type: 'bar',
                data: {
                    labels: dailyRegistrations.map(i => new Date(i.label).toLocaleDateString()),
                    datasets: [{ label: 'New Patients', data: dailyRegistrations.map(i => i.value), backgroundColor: '#1a73e8' }]
                }
            });

            // Financial Chart
            new Chart(document.getElementById('financeChart'), {
                type: 'line',
                data: {
                    labels: monthlyRevenue.map(i => i.label),
                    datasets: [{ label: 'Revenue (₹)', data: monthlyRevenue.map(i => i.value), borderColor: '#34a853', fill: false }]
                }
            });

            // Workload Chart
            new Chart(document.getElementById('workloadChart'), {
                type: 'pie',
                data: {
                    labels: doctorWorkload.map(i => i.label),
                    datasets: [{ data: doctorWorkload.map(i => i.value), backgroundColor: ['#4285f4', '#34a853', '#fbbc05', '#ea4335', '#673ab7'] }]
                }
            });

            // Appointment Chart
            new Chart(document.getElementById('appointmentChart'), {
                type: 'polarArea',
                data: {
                    labels: appointmentStats.map(i => i.label),
                    datasets: [{ data: appointmentStats.map(i => i.value), backgroundColor: ['#1a73e8', '#34a853', '#ea4335'] }]
                }
            });
        }
    } catch (err) { console.error(err); }
});
