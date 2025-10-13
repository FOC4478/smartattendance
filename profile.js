const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Fetch student profile data
fetch('get_profile.php')
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      alert('Error loading profile: ' + data.error);
      return;
    }

    document.getElementById('studentName').textContent = data.full_name;
    document.getElementById('studentEmail').textContent = data.email;
    document.getElementById('studentDept').textContent = data.department;
    document.getElementById('studentCourse').textContent = data.course;
    document.getElementById('studentMatric').textContent = data.matric_no;
  })
  .catch(err => console.error('Error fetching profile:', err));
