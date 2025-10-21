document.addEventListener("DOMContentLoaded", () => {
  // Call backend logout API
  fetch("logout.php")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Redirect to login page after logout
        window.location.href = "login.html";
      } else {
        alert("Logout failed. Please try again.");
      }
    })
    .catch(() => {
      alert("Network error. Please check your connection.");
    });
});
