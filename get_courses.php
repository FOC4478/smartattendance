<?php
include 'db_connect.php'; // $pdo

try {
    $stmt = $pdo->query("SELECT * FROM courses ORDER BY date_created DESC");
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($courses);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>







<!-- 
include 'db_connect.php'; 
$sql = "SELECT * FROM courses ORDER BY date_created DESC";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(['success' => false, 'message' => $conn->error]);
    exit;
}

$courses = [];
while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}

echo json_encode($courses);

$conn->close();
?> -->



