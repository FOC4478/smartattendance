<?php
include 'db_connect.php';
$sql = "SELECT student_id, full_name, matric_no, department, level, email, barcode, date_registered 
        FROM students 
        ORDER BY date_registered DESC";

$result = $conn->query($sql);

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

echo json_encode($students);
$conn->close();
?>

