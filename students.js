document.addEventListener('DOMContentLoaded', () => {
const hamburger = document.getElementById("hamburger");
const sidebar = document.querySelector(".sidebar");
const modal = document.getElementById("studentModal");
const openBtn = document.getElementById("addStudentBtn");
const closeBtn = document.querySelector(".closeBtn");
const form = document.getElementById("studentForm");
const modalTitle = document.getElementById("modalTitle");
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchStudent");

hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});


let editMode = false;
let editStudentId = null;

// Open modal for new student
openBtn.addEventListener("click", () => {
  modal.style.display = "block";
  modalTitle.textContent = "Add Student";
  form.reset();
  editMode = false;
});

// Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Load students
async function loadStudents() {
  try {
    const response = await fetch("backend/get_students.php");
    const students = await response.json();

    studentTableBody.innerHTML = "";
    students.forEach(student => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.full_name}</td>
        <td>${student.email}</td>
        <td>${student.course}</td>
        <td>
          <button class="editBtn" data-id="${student.id}">Edit</button>
          <button class="deleteBtn" data-id="${student.id}">Delete</button>
        </td>
      `;
      studentTableBody.appendChild(row);
    });

    attachRowEvents();
  } catch (error) {
    console.error("Error loading students:", error);
  }
}

// Add or update student
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  if (editMode) formData.append("id", editStudentId);
  const endpoint = editMode ? "backend/update_student.php" : "backend/add_student.php";

  try {
    const response = await fetch(endpoint, { method: "POST", body: formData });
    const result = await response.json();
    alert(result.message);
    if (result.success) {
      modal.style.display = "none";
      loadStudents();
    }
  } catch (error) {
    console.error("Error saving student:", error);
  }
});

// Attach edit and delete events
function attachRowEvents() {
  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      editMode = true;
      editStudentId = id;

      const response = await fetch(`backend/get_student.php?id=${id}`);
      const student = await response.json();

      modal.style.display = "block";
      modalTitle.textContent = "Edit Student";
      document.getElementById("full_name").value = student.full_name;
      document.getElementById("email").value = student.email;
      document.getElementById("course").value = student.course;
    });
  });

  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Are you sure you want to delete this student?")) return;

      try {
        const response = await fetch("backend/delete_student.php", {
          method: "POST",
          body: new URLSearchParams({ id })
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) loadStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    });
  });
}

// Search functionality
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  const rows = studentTableBody.querySelectorAll("tr");
  rows.forEach(row => {
    const name = row.children[1].textContent.toLowerCase();
    row.style.display = name.includes(filter) ? "" : "none";
  });
});

document.addEventListener("DOMContentLoaded", loadStudents);
});