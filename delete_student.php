<?php
header('Content-Type: application/json');
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Read student ID from POST
$id = intval($_POST['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid student ID']);
    exit;
}

// Delete student
$stmt = $conn->prepare("DELETE FROM students WHERE student_id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Student deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error deleting student: ' . $stmt->error]);
}

$stmt->close();
$conn->close();

