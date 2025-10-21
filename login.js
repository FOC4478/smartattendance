document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // prevent default submit

        const formData = new FormData(form);

       fetch('login.php', {
       method: 'POST',
       body: formData
       })

        .then(response => response.text())
        .then(data => {
            if (data.includes('admin')) {
                window.location.href = 'admin.html';
            } else if (data.includes('student')) {
                window.location.href = 'studentdashboard.html';
            } else {
                alert(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error connecting to server.');
        });
    });
});
