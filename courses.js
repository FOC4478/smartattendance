document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.querySelector('.sidebar');
  const form = document.getElementById('addCourseForm');
  const tableBody = document.getElementById('courseTableBody');

  // Sidebar toggle
  hamburger.addEventListener('click', () => sidebar.classList.toggle('active'));

  // Load all courses
  function loadCourses() {
    fetch('get_courses.php')
      .then(res => res.json())
      .then(data => {
        tableBody.innerHTML = '';
        data.forEach((course, index) => {
          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${course.course_code}</td>
              <td>${course.course_name}</td>
              <td>
                <button class="delete-btn" data-id="${course.course_id}">Delete</button>
              </td>
            </tr>
          `;
          tableBody.insertAdjacentHTML('beforeend', row);
        });
        attachDeleteEvents();
      })
      .catch(err => console.error('Error loading courses:', err));
  }

  // Add course
  form.addEventListener('submit', e => {
    e.preventDefault();
    const courseName = document.getElementById('courseName').value.trim();
    const courseCode = document.getElementById('courseCode').value.trim();

    if (!courseName || !courseCode) return alert("Please fill all fields");

    // Send as URL-encoded
    const data = `course_name=${encodeURIComponent(courseName)}&course_code=${encodeURIComponent(courseCode)}`;

    fetch('add_course.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      if (data.success) {
        form.reset();
        loadCourses();
      }
    })
    .catch(err => console.error('Error adding course:', err));
  });

  // Delete course
  function attachDeleteEvents() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (!confirm('Delete this course?')) return;

        fetch('delete_course.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `course_id=${id}`
        })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          if (data.success) loadCourses();
        })
        .catch(err => console.error('Error deleting course:', err));
      });
    });
  }

  // Initial load
  loadCourses();
});














