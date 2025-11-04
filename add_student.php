<?php
header('Content-Type: application/json');
include 'db_connect.php'; 

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$full_name  = $_POST['full_name'] ?? '';
$matric_no  = $_POST['matric_no'] ?? '';
$department = $_POST['department'] ?? '';
$level      = $_POST['level'] ?? '';
$email      = $_POST['email'] ?? '';
$password   = $_POST['password'] ?? '';

if (!$full_name || !$matric_no || !$department || !$level || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Please fill all fields']);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO students (full_name, matric_no, department, level, email, password) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$full_name, $matric_no, $department, $level, $email, $hashedPassword]);

    echo json_encode(['success' => true, 'message' => 'Student added successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}