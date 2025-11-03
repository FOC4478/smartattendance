<?php
session_start();
include 'db_connect.php';

if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$student_id = $_SESSION['student_id'];

// Get form data safely
$full_name = $_POST['full_name'] ?? '';
$email = $_POST['email'] ?? '';
$level = $_POST['level'] ?? '';
$department = $_POST['department'] ?? '';

// Handle photo upload
$photo_name = null;
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $tmp_name = $_FILES['photo']['tmp_name'];
    $photo_name = time() . "_" . basename($_FILES['photo']['name']);
    move_uploaded_file($tmp_name, __DIR__ . "/uploads/" . $photo_name);
}

// Build the SQL dynamically depending on whether a photo was uploaded
if ($photo_name) {
    $sql = "UPDATE students SET full_name = ?, email = ?, level = ?, department = ?, photo = ? WHERE student_id = ?";
    $params = [$full_name, $email, $level, $department, $photo_name, $student_id];
} else {
    $sql = "UPDATE students SET full_name = ?, email = ?, level = ?, department = ? WHERE student_id = ?";
    $params = [$full_name, $email, $level, $department, $student_id];
}

// Prepare and execute
try {
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute($params);

    if ($success) {
        echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Update failed"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
