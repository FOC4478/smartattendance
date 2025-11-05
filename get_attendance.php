<?php
header('Content-Type: application/json');
include 'db_connect.php';

try {
    $query = "
        SELECT 
            a.attendance_id,
            s.full_name AS student_name,
            c.course_name AS course_name,
            a.date_marked,
            a.status
        FROM attendance a
        JOIN students s ON a.student_id = s.student_id
        JOIN courses c ON a.course_id = c.course_id
        ORDER BY a.date_marked DESC, a.time_marked DESC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Always return an array
    echo json_encode($records ?? []);
} catch (PDOException $e) {
    // Return empty array on error
    echo json_encode([]);
}
?>

