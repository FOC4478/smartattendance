<?php
header('Content-Type: application/json');
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $course_name = trim($_POST['course_name'] ?? '');
    $course_code = trim($_POST['course_code'] ?? '');

    if (empty($course_name) || empty($course_code)) {
        echo json_encode(["success" => false, "message" => "Please fill all fields."]);
        exit;
    }

    // Insert course
    $stmt = $conn->prepare("INSERT INTO courses (course_name, course_code) VALUES (?, ?)");
    $stmt->bind_param("ss", $course_name, $course_code);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Course added successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error adding course: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}



