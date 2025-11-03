<?php
session_start();
header('Content-Type: application/json');

// Include database
include 'db_connect.php';

// Ensure student is logged in
if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

try {
    $student_id = $_SESSION['student_id'];

    $sql = "
        SELECT a.date_marked, c.course_name, a.status
        FROM attendance a
        JOIN courses c ON a.course_id = c.course_id
        WHERE a.student_id = ?
        ORDER BY a.date_marked DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$student_id]);
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Make sure no extra output before JSON
    echo json_encode($records);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
