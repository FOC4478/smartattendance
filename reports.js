document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const courseSelect = document.getElementById("courseSelect");
  const dateInput = document.getElementById("dateInput");
   const filterBtn = document.getElementById("filterBtn");
  const exportPDF = document.getElementById("exportPDF");
  const exportCSV = document.getElementById("exportCSV");
  const reportTableBody = document.getElementById("reportTableBody");
  const totalPresent = document.getElementById("presentCount");
  const totalAbsent = document.getElementById("absentCount");
  const attendancePercent = document.getElementById("attendancePercent");

 // Sidebar toggle for mobile
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Load Courses
  async function loadCourses() {
    const res = await fetch("get_courses.php");
    const courses = await res.json();
    courseSelect.innerHTML = `<option value="">Select Course</option>`;
    courses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.course_name;
      courseSelect.appendChild(opt);
    });
  }

  // Load Reports
  async function loadReports() {
    const courseId = courseSelect.value;
    const date = dateInput.value;
    const query = new URLSearchParams({ course_id: courseId, date }).toString();

    const res = await fetch(`get_reports.php?${query}`);
    const records = await res.json();

    reportTableBody.innerHTML = "";
    if (records.length === 0) {
      reportTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No records found</td></tr>`;
      updateSummary([]);
      return;
    }

    records.forEach((r, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${r.full_name}</td>
        <td>${r.course_name}</td>
        <td>${r.date_marked}</td>
        <td>${r.time_marked}</td>
        <td class="${r.status === 'Present' ? 'text-success' : 'text-danger'}">${r.status}</td>
      `;
      reportTableBody.appendChild(row);
    });

    updateSummary(records);
  }

  // Update Summary
  function updateSummary(records) {
    const total = records.length;
    const present = records.filter(r => r.status === "Present").length;
    const absent = total - present;
    const percent = total ? ((present / total) * 100).toFixed(1) : 0;

    totalPresent.textContent = present;
    totalAbsent.textContent = absent;
    attendancePercent.textContent = percent + "%";
  }

  // Filter Button
  document.getElementById("filterForm").addEventListener("submit", e => {
    e.preventDefault();
    loadReports();
  });

  // Export CSV
  document.getElementById("exportCSV").addEventListener("click", () => {
    const rows = [["#", "Student Name", "Course", "Date", "Time", "Status"]];
    document.querySelectorAll("#reportTableBody tr").forEach(tr => {
      const cols = Array.from(tr.children).map(td => td.textContent);
      rows.push(cols);
    });

    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance_report.csv";
    link.click();
  });

  // Export PDF
  document.getElementById("exportPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 15);
    const rows = [];
    document.querySelectorAll("#reportTableBody tr").forEach(tr => {
      rows.push(Array.from(tr.children).map(td => td.textContent));
    });
    doc.autoTable({
      head: [["#", "Student Name", "Course", "Date", "Time", "Status"]],
      body: rows,
      startY: 25,
    });
    doc.save("attendance_report.pdf");
  });

  loadCourses();
  loadReports();
});



