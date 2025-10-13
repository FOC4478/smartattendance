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
            if (data.includes('admin.php')) {
                window.location.href = 'admin.php';
            } else if (data.includes('studentdashboard.php')) {
                window.location.href = 'studentdashboard.php';
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
