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

      if (!Array.isArray(courses)) {
        console.error("Invalid courses data:", courses);
        return;
      }

      courseSelect.innerHTML = `<option value="">Select Course</option>`;
      courses.forEach(c => {
        const option = document.createElement("option");
        option.value = c.course_id;
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
      console.log("Attendance response:", records); // <-- inspect this in console

      // Validate response is an array
      if (!Array.isArray(records)) {
        console.error("Expected array from get_attendance.php but received:", records);
        // Optionally show user-friendly message in table
        attendanceTableBody.innerHTML = `<tr><td colspan="7">Unable to load attendance (see console).</td></tr>`;
        return;
      }

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
      attendanceTableBody.innerHTML = `<tr><td colspan="7">Error loading attendance (see console).</td></tr>`;
    }
  }

  // Submit attendance (manual or scan)
  async function submitAttendance() {
    let barcode = barcodeInput.value.trim();
    const courseId = courseSelect.value;

    if (!barcode || !courseId) {
      alert("Please enter barcode and select course");
      return;
    }

    // Clean common unwanted characters (trim, remove whitespace/newlines)
    barcode = barcode.replace(/\s+/g, "");

    const data = `barcode=${encodeURIComponent(barcode)}&course_id=${encodeURIComponent(courseId)}`;

    try {
      const res = await fetch("mark_attendance.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data
      });

      // If backend returns non-JSON (HTML/warnings), this will throw and land in catch
      const result = await res.json();
      console.log("Mark attendance response:", result);
      alert(result.message ?? "No message from server");

      if (result.success) {
        barcodeInput.value = "";
        barcodeInput.focus();
        loadAttendance();
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance. Check console for details.");
    }
  }

  // Handle form submission (prevent reload)
  attendanceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitAttendance();
  });

  // Initialize live scanner
  const qrReader = new Html5Qrcode("qr-reader");

  function startScanner() {
    qrReader.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        console.log("Scanned text:", decodedText); // debug: what the scanner reads
        document.getElementById("scan-result").textContent = "Scanned: " + decodedText;
        barcodeInput.value = decodedText;
        // Directly call submitAttendance (more reliable than dispatchEvent)
        await submitAttendance();
      },
      (errorMessage) => {
        // ignore scanning errors
      }
    ).catch(err => console.error("Scanner error:", err));
  }

  // Initialize page
  loadCourses();
  loadAttendance();
  startScanner();
});





































