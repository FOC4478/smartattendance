document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  const addForm = document.getElementById("addStudentForm");
  const courseSelect = document.getElementById("courseSelect");
  const studentTableBody = document.getElementById("studentTableBody");

  // Sidebar toggle for mobile
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Load courses into the dropdown
  async function loadCourses() {
    try {
      const res = await fetch("get_courses.php");
      const courses = await res.json();

      courseSelect.innerHTML = `<option value="">Select Course</option>`;
      courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.course_name;
        courseSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  }

  // Load students into the table
  async function loadStudents() {
    try {
      const res = await fetch("get_students.php");
      const students = await res.json();

      studentTableBody.innerHTML = "";
      students.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${student.full_name}</td>
          <td>${student.matric_no}</td>
          <td>${student.department}</td>
          <td>${student.level}</td>
          <td>${student.email}</td>
          <td>${student.barcode}</td>
          <td>${student.date_registered}</td>
          <td>
            <button class="delete-btn" data-id="${student.student_id}">Delete</button>
          </td>
        `;
        studentTableBody.appendChild(row);
      });

      attachDeleteEvents();
    } catch (err) {
      console.error("Error loading students:", err);
    }
  }

  // Add student
  addForm.addEventListener("submit", e => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const matricNo = document.getElementById("matricNo").value.trim();
    const department = document.getElementById("department").value.trim();
    const level = document.getElementById("level").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!fullName || !matricNo || !department || !level || !email || !password) {
      return alert("Please fill all fields");
    }

    // URL-encoded data
    const data = `full_name=${encodeURIComponent(fullName)}&matric_no=${encodeURIComponent(matricNo)}&department=${encodeURIComponent(department)}&level=${encodeURIComponent(level)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    fetch("add_student.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data
    })
    .then(res => res.json())
    .then(result => {
      alert(result.message);
      if (result.success) {
        addForm.reset();
        loadStudents();
      }
    })
    .catch(err => console.error("Error adding student:", err));
  });

  // Delete student
  function attachDeleteEvents() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!confirm("Are you sure you want to delete this student?")) return;
        const id = btn.dataset.id;

        fetch("delete_student.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `id=${encodeURIComponent(id)}`
        })
        .then(res => res.json())
        .then(result => {
          alert(result.message);
          if (result.success) loadStudents();
        })
        .catch(err => console.error("Error deleting student:", err));
      });
    });
  }

  // Initialize page
  loadCourses();
  loadStudents();
});

























// document.addEventListener('DOMContentLoaded', () => {
//   const hamburger = document.getElementById("hamburger");
//   const sidebar = document.querySelector(".sidebar");
//   const addForm = document.getElementById("addStudentForm");
//   const courseSelect = document.getElementById("courseSelect");
//   const studentTableBody = document.getElementById("studentTableBody");

  // Toggle sidebar on mobile
  // hamburger.addEventListener("click", () => {
  //   sidebar.classList.toggle("active");
  // });

  // Load courses for dropdown
  // async function loadCourses() {
  //   try {
  //     const response = await fetch("get_courses.php");
  //     const courses = await response.json();

  //     courseSelect.innerHTML = `<option value="">Select Course</option>`;
  //     courses.forEach(course => {
  //       const option = document.createElement("option");
  //       option.value = course.id;
  //       option.textContent = course.course_name;
  //       courseSelect.appendChild(option);
  //     });
  //   } catch (error) {
  //     console.error("Error loading courses:", error);
  //   }
  // }

  // Load students
  // async function loadStudents() {
  //   try {
  //     const response = await fetch("get_students.php");
  //     const students = await response.json();

  //     studentTableBody.innerHTML = "";
  //     students.forEach(student => {
  //       const row = document.createElement("tr");
  //       row.innerHTML = `
  //        <td>${student.student_id}</td>
  //        <td>${student.full_name}</td>
  //        <td>${student.matric_no}</td>
  //        <td>${student.department}</td>
  //        <td>${student.level}</td>
  //        <td>${student.email}</td>
  //        <td>${student.barcode}</td>
  //        <td>${student.date_registered}</td>
  //        <td><button class="delete-btn" data-id="${student.id}">Delete</button></td>
  //         `;
  //       studentTableBody.appendChild(row);
  //     });

  //     attachDeleteEvents();
  //   } catch (error) {
  //     console.error("Error loading students:", error);
  //   }
  // }

  // Add student
  // addForm.addEventListener("submit", async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(addForm);

  //   try {
  //     const response = await fetch("add_student.php", {
  //       method: "POST",
  //       body: formData
  //     });
  //     const result = await response.json();
  //     alert(result.message);
  //     if (result.success) {
  //       addForm.reset();
  //       loadStudents();
  //     }
  //   } catch (error) {
  //     console.error("Error adding student:", error);
  //   }
  // });

  // Delete student
  // function attachDeleteEvents() {
  //   document.querySelectorAll(".deleteBtn").forEach(btn => {
  //     btn.addEventListener("click", async () => {
  //       if (!confirm("Are you sure you want to delete this student?")) return;
  //       const id = btn.dataset.id;

  //       try {
  //         const response = await fetch("delete_student.php", {
  //           method: "POST",
  //           body: new URLSearchParams({ id })
  //         });
  //         const result = await response.json();
  //         alert(result.message);
  //         if (result.success) loadStudents();
  //       } catch (error) {
  //         console.error("Error deleting student:", error);
  //       }
  //     });
  //   });
  // }

  // Initialize
//   loadCourses();
//   loadStudents();
// });
