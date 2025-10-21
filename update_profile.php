<?php
session_start();
include 'db_connect.php';

if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$student_id = $_SESSION['student_id'];

// Get form data
$full_name = $_POST['full_name'] ?? '';
$email = $_POST['email'] ?? '';
$level = $_POST['level'] ?? '';
$department = $_POST['department'] ?? '';

// Handle photo upload
$photo_name = null;
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $tmp_name = $_FILES['photo']['tmp_name'];
    $photo_name = time() . "_" . $_FILES['photo']['name'];
    move_uploaded_file($tmp_name, "uploads/" . $photo_name);
}

// Update database
$sql = "UPDATE students SET full_name=?, email=?, level=?, department=?".($photo_name ? ", photo=?" : "")." WHERE student_id=?";
$stmt = $conn->prepare($sql);

if ($photo_name) {
    $stmt->bind_param("sssssi", $full_name, $email, $level, $department, $photo_name, $student_id);
} else {
    $stmt->bind_param("ssssi", $full_name, $email, $level, $department, $student_id);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}
?>
