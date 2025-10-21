// register.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const pwd = document.getElementById("password");
  const confirm = document.getElementById("confirm_password");
  const matric = document.getElementById("matric_no");
  const email = document.getElementById("email");

  form.addEventListener("submit", (e) => {
    // basic client validation
    if (pwd.value !== confirm.value) {
      e.preventDefault();
      alert("Passwords do not match. Please confirm your password.");
      return false;
    }

    if (!matric.value.trim()) {
      e.preventDefault();
      alert("Please enter your matric number.");
      return false;
    }

    // simple email format check
    const emailValue = email.value.trim();
    if (emailValue && !/^\S+@\S+\.\S+$/.test(emailValue)) {
      e.preventDefault();
      alert("Please enter a valid email address.");
      return false;
    }

    // allow submit — server will do complete validation
  });
});

