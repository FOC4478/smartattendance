document.addEventListener('DOMContentLoaded', () => {
  const reportTableBody = document.getElementById('reportTableBody');
  const filterBtn = document.getElementById('filterBtn');
  const exportBtn = document.getElementById('exportBtn');
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');

  // Sample data
  const reports = [
    { id: '' , name: '', course: '', date: '', status: '' },
    { id: '', name: '', course: '', date: '', status: '' },
    { id: '', name: '', course: '', date: '', status: '' },
  ];

  function displayReports(data) {
    reportTableBody.innerHTML = '';
    data.forEach(r => {
      const row = `
        <tr>
          <td>${r.id}</td>
          <td>${r.name}</td>
          <td>${r.course}</td>
          <td>${r.date}</td>
          <td>${r.status}</td>
        </tr>`;
      reportTableBody.innerHTML += row;
    });
  }

  displayReports(reports);

  // Filter logic
  filterBtn.addEventListener('click', () => {
    const course = document.getElementById('courseFilter').value;
    const date = document.getElementById('dateFilter').value;

    const filtered = reports.filter(r => {
      return (!course || r.course === course) && (!date || r.date === date);
    });

    displayReports(filtered);
  });

  // Export logic
  exportBtn.addEventListener('click', () => {
    alert('Report exported successfully!');
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
});
