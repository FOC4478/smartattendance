document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');

// Sidebar toggle for mobile
  burger.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });

// Fetch dashboard data
fetch('studentdashboard.php')
  .then(res => res.json())
  .then(data => {
    const student = data.student;

    // Set student info
    document.getElementById('studentName').innerText = student.full_name;
    document.getElementById('studentBarcode').innerText = student.barcode;
    document.getElementById('studentQR').src = student.barcode;
    document.getElementById('attendancePercent').innerText = data.attendance_percent + '%';
    document.getElementById('totalPresent').innerText = data.present;
    document.getElementById('totalAbsent').innerText = data.absent;
    document.getElementById('currentMonth').innerText = new Date(data.year, data.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    document.getElementById('currentYear').innerText = data.year;

    // Set QR code image and download link
     const qrImg = document.getElementById('studentQR');
     const downloadQR = document.getElementById('downloadQR');
     qrImg.src = student.barcode;
     downloadQR.href = student.barcode;
  
    // Avatar
    const avatarDiv = document.getElementById('studentAvatar');
    if (student.photo) {
      avatarDiv.innerHTML = `<img src="uploads/${student.photo}" alt="photo">`;
    } else {
      avatarDiv.innerHTML = `<div class="initials">${student.full_name.charAt(0).toUpperCase()}</div>`;
    }

    // Render calendar
    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';
    for (const [day, status] of Object.entries(data.calendar)) {
      const div = document.createElement('div');
      div.classList.add('day');
      if (status === 'present') div.classList.add('present');
      else if (status === 'absent') div.classList.add('absent');
      div.innerText = day;
      daysGrid.appendChild(div);
    }

    // Chart.js
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.chart.labels,
        datasets: [
          { label: 'Present', data: data.chart.present, backgroundColor: 'green' },
          { label: 'Absent', data: data.chart.absent, backgroundColor: 'red' }
        ]
      },
      options: { responsive: true }
    });
  })
  .catch(err => console.error(err));
});
