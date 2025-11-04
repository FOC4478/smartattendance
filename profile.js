document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById('closeBtn');
  const form = document.getElementById("profile-form");
  const statusMsg = document.getElementById("status-msg");
  const profilePhoto = document.getElementById("profile-photo");

  // Sidebar toggle
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
  // Close sidebar
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

  // Load student profile
  fetch("profile.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const student = data.student;
        document.getElementById("full_name").value = student.full_name;
        document.getElementById("email").value = student.email;
        document.getElementById("department").value = student.department;
        document.getElementById("level").value = student.level;
        profilePhoto.src = student.photo ? "uploads/" + student.photo : "images/default-avatar.png";
      } else {
        statusMsg.textContent = data.message;
        statusMsg.style.color = "red";
      }
    });

  // Update profile
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    fetch("update_profile.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        statusMsg.textContent = data.message;
        statusMsg.style.color = data.success ? "green" : "red";
      })
      .catch(() => {
        statusMsg.textContent = "Error updating profile.";
        statusMsg.style.color = "red";
      });
  });
});


