// ===== Sidebar Toggle =====
const hamburger = document.getElementById('hamburger');
const sidebar = document.querySelector('.sidebar');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

// ===== Logout Button =====
const logoutBtn = document.querySelector('.btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = 'logout.php';
    }
  });
}

// ===== Animate Counter =====
function animateCounter(id, start, end, duration) {
  const element = document.getElementById(id);
  if (!element) return;
  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

// ===== Load Data from Backend =====
function loadDashboardData() {
  fetch('get_dashboard_data.php')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error(data.error);
        return;
      }

      animateCounter('studentsCount', 0, data.students, 1000);
      animateCounter('coursesCount', 0, data.courses, 1000);
      animateCounter('attendanceCount', 0, data.attendance, 1000);
    })
    .catch(err => console.error('Error fetching data:', err));
}

window.addEventListener('load', loadDashboardData);


