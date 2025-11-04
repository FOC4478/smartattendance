<?php
// profile.php
session_start();
include 'db_connect.php'; 

if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$student_id = $_SESSION['student_id'];

// Prepare and execute
$stmt = $pdo->prepare("SELECT * FROM students WHERE student_id = ?");
$stmt->execute([$student_id]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$student) {
    echo json_encode(["error" => "Student not found"]);
    exit;
}

// Output JSON
header('Content-Type: application/json');
echo json_encode($student);
?>
