document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
     const tableBody = document.getElementById('attendanceData');
     
    hamburger.addEventListener('click', () => sidebar.classList.toggle('active'));

    fetch('studentattendance.php')
        .then(res => res.json())
        .then(data => {
            tableBody.innerHTML = '';

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3">No attendance records found.</td></tr>';
                return;
            }

            data.forEach(record => {
                const tr = document.createElement('tr');

                const dateTd = document.createElement('td');
                dateTd.textContent = record.date_marked;

                const courseTd = document.createElement('td');
                courseTd.textContent = record.course_name;

                const statusTd = document.createElement('td');
                statusTd.textContent = record.status;
                statusTd.classList.add(record.status === 'present' ? 'present' : 'absent');

                tr.appendChild(dateTd);
                tr.appendChild(courseTd);
                tr.appendChild(statusTd);

                tableBody.appendChild(tr);
            });
        })
        .catch(err => {
            tableBody.innerHTML = '<tr><td colspan="3">Error loading attendance.</td></tr>';
            console.error(err);
        });
});

