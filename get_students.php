<?php
include 'db_connect.php'; 

$sql = "SELECT student_id, full_name, matric_no, department, level, email, barcode, date_registered 
        FROM students 
        ORDER BY date_registered DESC";

$stmt = $pdo->query($sql);
$students = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($students);
?>
