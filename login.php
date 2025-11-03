<?php
session_start();
include 'db_connect.php'; 

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$role = $_POST['role'] ?? '';
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($role) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill all fields']);
    exit;
}

// Determine table
if ($role === 'student') {
    $sql = "SELECT * FROM students WHERE email = ?";
} elseif ($role === 'admin') {
    $sql = "SELECT * FROM admins WHERE email = ?";
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid role selected']);
    exit;
}

$stmt = $pdo->prepare($sql);
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'No account found with that email']);
    exit;
}

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid password']);
    exit;
}

// Login success
if ($role === 'student') {
    $_SESSION['student_id'] = $user['student_id'];
    $_SESSION['student_name'] = $user['full_name'];
    $redirect = 'studentdashboard.php';
} else {
    $_SESSION['admin_id'] = $user['admin_id'];
    $_SESSION['admin_name'] = $user['full_name'];
    $redirect = 'admin.php';
}

echo json_encode([
    'success' => true,
    'role' => $role,
    'redirect' => $redirect
]);
exit;
?>
