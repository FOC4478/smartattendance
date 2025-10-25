document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  const barcodeInput = document.getElementById("barcode");
  const courseSelect = document.getElementById("courseSelect");
  const attendanceForm = document.getElementById("attendanceForm");
  const attendanceTableBody = document.getElementById("attendanceTableBody");

  // Toggle sidebar
  hamburger.addEventListener("click", () => sidebar.classList.toggle("active"));

  // Load courses into dropdown
  async function loadCourses() {
    try {
      const res = await fetch("get_courses.php");
      const courses = await res.json();
      courseSelect.innerHTML = `<option value="">Select Course</option>`;
      courses.forEach(c => {
        const option = document.createElement("option");
        option.value = c.course_id; // must match PHP DB column
        option.textContent = c.course_name;
        courseSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  }

  // Load attendance records
  async function loadAttendance() {
    try {
      const res = await fetch("get_attendance.php");
      const records = await res.json();
      attendanceTableBody.innerHTML = "";
      if (records.length === 0) {
        attendanceTableBody.innerHTML = `<tr><td colspan="7">No attendance recorded yet.</td></tr>`;
        return;
      }

      records.forEach((r, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${r.full_name}</td>
          <td>${r.course_name}</td>
          <td>${r.barcode_scanned}</td>
          <td>${r.date_marked}</td>
          <td>${r.time_marked}</td>
          <td>${r.status}</td>
        `;
        attendanceTableBody.appendChild(row);
      });
    } catch (err) {
      console.error("Error loading attendance:", err);
    }
  }

  // Handle attendance form submit
  attendanceForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const barcode = barcodeInput.value.trim();
    const courseId = courseSelect.value;

    if (!barcode || !courseId) return alert("Please enter barcode and select course");

    const data = `barcode=${encodeURIComponent(barcode)}&course_id=${encodeURIComponent(courseId)}`;

    try {
      const res = await fetch("mark_attendance.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) {
        barcodeInput.value = "";
        barcodeInput.focus();
        loadAttendance();
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  });

  // Initialize live scanner
const qrReader = new Html5Qrcode("qr-reader");

function startScanner() {
  qrReader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {
      document.getElementById("scan-result").textContent = "Scanned: " + decodedText;
      barcodeInput.value = decodedText;
      attendanceForm.dispatchEvent(new Event("submit")); // auto-submit after scan
    },
    (errorMessage) => {
      // ignore scanning errors
    }
  ).catch(err => console.error("Scanner error:", err));
}

startScanner();


  // Initialize page
  loadCourses();
  loadAttendance();
});




































