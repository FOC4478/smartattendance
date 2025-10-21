<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php'; 

$course_id = isset($_GET['course_id']) ? intval($_GET['course_id']) : 0;
$date = isset($_GET['date']) ? $_GET['date'] : '';

$query = "SELECT a.*, s.full_name, s.matric_no, c.course_name
          FROM attendance a
          JOIN students s ON a.student_id = s.student_id
          JOIN courses c ON a.course_id = c.course_id
          WHERE 1";

$params = [];
$types = '';

if ($course_id > 0) {
    $query .= " AND a.course_id = ?";
    $params[] = $course_id;
    $types .= 'i';
}

if (!empty($date)) {
    $query .= " AND a.date_marked = ?";
    $params[] = $date;
    $types .= 's';
}

$stmt = $conn->prepare($query);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$records = [];
while ($row = $result->fetch_assoc()) {
    $records[] = [
        'full_name' => $row['full_name'],
        'matric_no' => $row['matric_no'],
        'course_name' => $row['course_name'],
        'date_marked' => $row['date_marked'],
        'time_marked' => $row['time_marked'],
        'status' => $row['status']
    ];
}

echo json_encode($records);
$stmt->close();
$conn->close();
?>

