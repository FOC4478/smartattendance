<?php
header('Content-Type: application/json');
include 'db_connect.php'; 

try {
    // Counts from tables
    $students = $pdo->query("SELECT COUNT(*) AS total FROM students")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    $courses = $pdo->query("SELECT COUNT(*) AS total FROM courses")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    $attendance = $pdo->query("SELECT COUNT(*) AS total FROM attendance")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

    echo json_encode([
        'students' => (int)$students,
        'courses' => (int)$courses,
        'attendance' => (int)$attendance
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>








<!-- 

header('Content-Type: application/json');
include 'db_connect.php';

try {
  // Counts from attendance-related tables
  $students = $conn->query("SELECT COUNT(*) AS total FROM students")->fetch_assoc()['total'] ?? 0;
  $courses = $conn->query("SELECT COUNT(*) AS total FROM courses")->fetch_assoc()['total'] ?? 0;
  $attendance = $conn->query("SELECT COUNT(*) AS total FROM attendance")->fetch_assoc()['total'] ?? 0;

  echo json_encode([
    'students' => (int)$students,
    'courses' => (int)$courses,
    'attendance' => (int)$attendance
  ]);
} catch (Exception $e) {
  echo json_encode(['error' => $e->getMessage()]);
}
?> -->
