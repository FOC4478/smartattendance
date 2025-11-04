<?php
include 'db_connect.php'; 
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$id = intval($_POST['course_id'] ?? 0);
if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid course ID"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM courses WHERE course_id = ?");
    $success = $stmt->execute([$id]);

    if ($success) {
        echo json_encode(["success" => true, "message" => "Course deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error deleting course"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
