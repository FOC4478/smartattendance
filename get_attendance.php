<?php
header('Content-Type: application/json');
include 'db_connect.php'; 

try {
    $sql = "SELECT a.attendance_id, s.full_name, c.course_name, a.barcode_scanned, a.date_marked, a.time_marked, a.status
            FROM attendance a
            JOIN students s ON a.student_id = s.student_id
            JOIN courses c ON a.course_id = c.course_id
            ORDER BY a.date_marked DESC, a.time_marked DESC";

    $stmt = $pdo->query($sql);
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Always return a JSON array (empty array if no records)
    echo json_encode($records ?: []);
} catch (Exception $e) {
    // Return an object describing the error so frontend can detect it
    echo json_encode(['error' => $e->getMessage()]);
}
?>