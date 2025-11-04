<?php
include 'db_connect.php'; // $pdo

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM courses ORDER BY date_created DESC");
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($courses ?: []); // return empty array if no courses
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

