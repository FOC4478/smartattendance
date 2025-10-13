<?php
session_start();
include 'db_connect.php';

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $role = $_POST['role']; // admin or student
    $username = trim($_POST['email']);
    $password = trim($_POST['password']);

    if ($role === "admin") {
        $sql = "SELECT * FROM admin WHERE email = ?";
    } else {
        $sql = "SELECT * FROM students WHERE email = ?";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Check password
        if (password_verify($password, $user['password'])) {
            $_SESSION['username'] = $email;
            $_SESSION['role'] = $role;

            if ($role === "admin") {
                header("Location: admin.php");
            } else {
                header("Location: studentdashboard.php");
            }
            exit;
        } else {
            echo "<script>alert('Invalid password'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('User not found'); window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
}
?>
