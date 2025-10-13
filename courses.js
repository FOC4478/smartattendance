document.addEventListener('DOMContentLoaded', () => {
const hamburger = document.getElementById("hamburger");
const sidebar = document.querySelector(".sidebar");

hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Course Management Logic

const addCourseForm = document.getElementById("addCourseForm");
const courseTableBody = document.getElementById("courseTableBody");

// Load existing courses from backend
document.addEventListener("DOMContentLoaded", () => {
  fetch("courses.php?action=get")
    .then(res => res.json())
    .then(data => {
      data.forEach(course => addCourseRow(course));
    })
    .catch(err => console.error("Error loading courses:", err));
});

// Add new course
addCourseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const courseName = document.getElementById("courseName").value.trim();
  const courseCode = document.getElementById("courseCode").value.trim();

  if (courseName === "" || courseCode === "") {
    alert("Please fill out both fields!");
    return;
  }

  // Send to backend (you’ll create courses.php next)
  fetch("courses.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=add&courseName=${encodeURIComponent(courseName)}&courseCode=${encodeURIComponent(courseCode)}`
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        addCourseRow({ id: data.id, course_name: courseName, course_code: courseCode });
        addCourseForm.reset();
      } else {
        alert("Failed to add course.");
      }
    })
    .catch(err => console.error("Error adding course:", err));
});

// Function to add a row to the table
function addCourseRow(course) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${course.id}</td>
    <td>${course.course_name}</td>
    <td>${course.course_code}</td>
    <td>
      <button class="action-btn edit-btn" data-id="${course.id}">Edit</button>
      <button class="action-btn delete-btn" data-id="${course.id}">Delete</button>
    </td>
  `;
  courseTableBody.appendChild(tr);
}

// Handle Edit & Delete actions
courseTableBody.addEventListener("click", function (e) {
  const target = e.target;
  const id = target.getAttribute("data-id");

  // Delete Course
  if (target.classList.contains("delete-btn")) {
    if (confirm("Are you sure you want to delete this course?")) {
      fetch("courses.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=delete&id=${id}`
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            target.closest("tr").remove();
          } else {
            alert("Failed to delete course.");
          }
        })
        .catch(err => console.error("Error deleting course:", err));
    }
  }

  // Edit Course
  if (target.classList.contains("edit-btn")) {
    const row = target.closest("tr");
    const nameCell = row.children[1];
    const codeCell = row.children[2];

    const currentName = nameCell.textContent;
    const currentCode = codeCell.textContent;

    const newName = prompt("Edit course name:", currentName);
    const newCode = prompt("Edit course code:", currentCode);

    if (newName && newCode) {
      fetch("courses.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=edit&id=${id}&courseName=${encodeURIComponent(newName)}&courseCode=${encodeURIComponent(newCode)}`
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            nameCell.textContent = newName;
            codeCell.textContent = newCode;
          } else {
            alert("Failed to update course.");
          }
        })
        .catch(err => console.error("Error editing course:", err));
    }
  }
});
});
