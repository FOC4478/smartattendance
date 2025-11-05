<?php
header('Content-Type: application/json');
include 'db_connect.php'; // Make sure this file initializes $pdo

try {
    $query = "
        SELECT 
            a.attendance_id,
            s.full_name AS student_name,
            c.course_name AS course_name,
            a.date_marked,
            a.status
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN courses c ON a.course_id = c.id
        ORDER BY a.date_marked DESC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($records);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
