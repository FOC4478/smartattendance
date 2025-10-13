document.addEventListener("DOMContentLoaded", () => {
  const barcodeInput = document.getElementById("barcodeInput");
  const statusMessage = document.getElementById("statusMessage");
  const scannedInfo = document.getElementById("scannedInfo");
  const attendanceTableBody = document.getElementById("attendanceTableBody");
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  // Sidebar toggle for mobile
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    hamburger.classList.toggle("open");
  });

  // Hamburger animation
  hamburger.addEventListener("click", () => {
    const spans = hamburger.querySelectorAll("span");
    spans[0].classList.toggle("rotate1");
    spans[1].classList.toggle("hide");
    spans[2].classList.toggle("rotate2");
  });

  // Keep focus on barcode input
  barcodeInput.focus();
  document.body.addEventListener("click", () => barcodeInput.focus());

  // Listen for barcode scan
  barcodeInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const barcode = barcodeInput.value.trim();
      if (!barcode) return showStatus("Please scan a valid barcode.", "error");

      try {
        const response = await fetch("mark_attendance.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `barcode=${encodeURIComponent(barcode)}`
        });

        const data = await response.json();
        if (data.success) {
          showStatus("Attendance marked ✅", "success");
          showScannedInfo(data.student);
          addToAttendanceTable(data.student);
        } else {
          showStatus(data.message || "Student not found.", "error");
        }
      } catch {
        showStatus("Server error. Try again.", "error");
      }

      barcodeInput.value = "";
      barcodeInput.focus();
    }
  });

  function showStatus(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.className = type;
  }

  function showScannedInfo(student) {
    scannedInfo.innerHTML = `
      <p><strong>Name:</strong> ${student.name}</p>
      <p><strong>ID:</strong> ${student.student_id}</p>
      <p><strong>Course:</strong> ${student.course}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
    `;
  }

  function addToAttendanceTable(student) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.student_id}</td>
      <td>${student.name}</td>
      <td>${student.course}</td>
      <td>${new Date().toLocaleTimeString()}</td>
      <td><span class="badge success">Present</span></td>
    `;
    attendanceTableBody.prepend(row);
  }
});
