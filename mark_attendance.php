<?php
header('Content-Type: application/json');
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$barcode = $_POST['barcode'] ?? '';
$course_id = intval($_POST['course_id'] ?? 0);

if (!$barcode || !$course_id) {
    echo json_encode(['success' => false, 'message' => 'Barcode and course are required']);
    exit;
}

// Check student exists
$stmt = $pdo->prepare("SELECT student_id, full_name FROM students WHERE barcode = ?");
$stmt->execute([$barcode]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$student) {
    echo json_encode(['success' => false, 'message' => 'Student not found']);
    exit;
}

$student_id = $student['student_id'];
$student_name = $student['full_name'];

// Check if already marked today
$date = date('Y-m-d');
$stmt = $pdo->prepare("SELECT 1 FROM attendance WHERE student_id = ? AND course_id = ? AND date_marked = ?");
$stmt->execute([$student_id, $course_id, $date]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Attendance already marked for today']);
    exit;
}

// Insert attendance
$time = date('H:i:s');
$status = 'Present';

$insert_sql = "INSERT INTO attendance (student_id, course_id, barcode_scanned, date_marked, time_marked, status)
               VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $pdo->prepare($insert_sql);
$success = $stmt->execute([$student_id, $course_id, $barcode, $date, $time, $status]);

if ($success) {
    // Get course name
    $course_stmt = $pdo->prepare("SELECT course_name FROM courses WHERE course_id = ?");
    $course_stmt->execute([$course_id]);
    $course_name = $course_stmt->fetch(PDO::FETCH_ASSOC)['course_name'] ?? '';

    echo json_encode([
        'success' => true,
        'message' => "Attendance marked for $student_name",
        'student_name' => $student_name,
        'course_name' => $course_name,
        'status' => $status
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
