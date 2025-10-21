<?php
header('Content-Type: application/json');
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$full_name = $_POST['full_name'] ?? '';
$matric_no = $_POST['matric_no'] ?? '';
$department = $_POST['department'] ?? '';
$level = $_POST['level'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$full_name || !$matric_no || !$department || !$level || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Please fill all fields']);
    exit;
}

// Optional: hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into database
$stmt = $conn->prepare("INSERT INTO students (full_name, matric_no, department, level, email, password) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $full_name, $matric_no, $department, $level, $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Student added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();



