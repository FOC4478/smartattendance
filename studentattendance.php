<?php
session_start();
include 'db_connect.php';

// Ensure student is logged in
if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$student_id = $_SESSION['student_id'];

// Fetch attendance records with course names
$sql = "
    SELECT a.date_marked, c.course_name, a.status
    FROM attendance a
    JOIN courses c ON a.course_id = c.course_id
    WHERE a.student_id = ?
    ORDER BY a.date_marked DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

$records = [];
while ($row = $result->fetch_assoc()) {
    $records[] = $row;
}

header('Content-Type: application/json');
echo json_encode($records);
