<?php
header('Content-Type: application/json');
include 'db_connect.php';

$sql = "SELECT a.attendance_id, s.full_name, c.course_name, a.barcode_scanned, a.date_marked, a.time_marked, a.status
        FROM attendance a
        JOIN students s ON a.student_id = s.student_id
        JOIN courses c ON a.course_id = c.course_id
        ORDER BY a.date_marked DESC, a.time_marked DESC";

$result = $conn->query($sql);
$records = [];

while($row = $result->fetch_assoc()) {
    $records[] = $row;
}

echo json_encode($records);
$conn->close();
