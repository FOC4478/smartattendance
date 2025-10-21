<?php
session_start();
include 'db_connect.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $role = $_POST['role'];
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Validate role selection
    if (empty($role)) {
        echo "⚠️ Please select a role.";
        exit;
    }

    if ($role === 'student') {
        // STUDENT LOGIN LOGIC
        $sql = "SELECT * FROM students WHERE email = ?";
    } elseif ($role === 'admin') {
        // ADMIN LOGIN LOGIC
        $sql = "SELECT * FROM admins WHERE email = ?";
    } else {
        echo "⚠️ Invalid role selected.";
        exit;
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            // ✅ Login success
            if ($role === 'student') {
                $_SESSION['student_id'] = $user['student_id'];
                $_SESSION['student_name'] = $user['full_name'];
                echo "studentdashboard.php"; // JavaScript will redirect here
            } else {
                $_SESSION['admin_id'] = $user['admin_id'];
                $_SESSION['admin_name'] = $user['full_name'];
                echo "admin.php"; // JavaScript will redirect here
            }
        } else {
            echo "❌ Invalid password. Please try again.";
        }
    } else {
        echo "⚠️ No account found with that email.";
    }

    $stmt->close();
    $conn->close();
}
?>

