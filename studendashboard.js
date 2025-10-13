// Sidebar toggle
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Fetch dashboard data from backend
async function loadDashboardData() {
  try {
    const response = await fetch('dashboard.php');
    const data = await response.json();

    document.getElementById('studentName').textContent = `Welcome, ${data.full_name}`;
    document.getElementById('attendancePercent').textContent = `${data.percentage}%`;
    document.getElementById('presentDays').textContent = data.present;
    document.getElementById('absentDays').textContent = data.absent;

  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

loadDashboardData();
