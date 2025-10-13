const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Fetch attendance data
fetch('get_attendance.php')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#attendanceTable tbody');
    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">No attendance records found.</td></tr>`;
      return;
    }

    data.forEach(record => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${record.date}</td>
        <td>${record.course}</td>
        <td>${record.status}</td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error('Error fetching attendance:', err));
