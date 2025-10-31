<?php
session_start();
include 'db_connect.php';
include_once __DIR__ . '/phpqrcodeqrlib/qrlib.php'; 

function js_alert_and_back($msg) {
    echo "<script>alert(" . json_encode($msg) . "); window.history.back();</script>";
    exit;
}

// Ensure POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: register.html");
    exit;
}

// Collect & sanitize input
$full_name  = trim($_POST['full_name'] ?? '');
$matric_no  = trim($_POST['matric_no'] ?? '');
$department = trim($_POST['department'] ?? '');
$level      = trim($_POST['level'] ?? '');
$email      = trim($_POST['email'] ?? '');
$password   = $_POST['password'] ?? '';
$confirm    = $_POST['confirm_password'] ?? '';

// Validate input
if (empty($full_name) || empty($matric_no) || empty($email) || empty($password)) {
    js_alert_and_back('Please fill in all required fields.');
}

if ($password !== $confirm) {
    js_alert_and_back('Passwords do not match.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    js_alert_and_back('Invalid email address.');
}

// Check if matric_no or email exists
$checkSql = "SELECT student_id FROM students WHERE matric_no = ? OR email = ? LIMIT 1";
$stmt = $conn->prepare($checkSql);
$stmt->bind_param("ss", $matric_no, $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    $stmt->close();
    js_alert_and_back('A user with that matric number or email already exists.');
}
$stmt->close();

// Hash password
$hashed = password_hash($password, PASSWORD_DEFAULT);

// Handle photo upload (optional)
$photo_filename = null;
if (!empty($_FILES['photo']['name'])) {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $file = $_FILES['photo'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($ext, $allowed)) {
        js_alert_and_back('Invalid photo type.');
    }

    $photo_filename = 'photo_' . time() . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
    move_uploaded_file($file['tmp_name'], $uploadDir . $photo_filename);
}

// Insert student record
$insertSql = "INSERT INTO students (full_name, matric_no, department, level, email, password, photo)
              VALUES (?, ?, ?, ?, ?, ?, ?)";
$ins = $conn->prepare($insertSql);
$ins->bind_param("sssssss", $full_name, $matric_no, $department, $level, $email, $hashed, $photo_filename);

if (!$ins->execute()) {
    js_alert_and_back('Failed to register. Please try again.');
}
$student_id = $ins->insert_id;
$ins->close();

// ✅ Generate QR code (based on matric number)
$qrDir = __DIR__ . '/qrcodes/';
if (!is_dir($qrDir)) mkdir($qrDir, 0755, true);

$qrData = $matric_no;
$qrFile = $qrDir . "student_" . $student_id . ".png";
QRcode::png($qrData, $qrFile, QR_ECLEVEL_L, 5);

// Save QR path in the database
$barcodePath = 'qrcodes/student_' . $student_id . '.png';
$update = $conn->prepare("UPDATE students SET barcode = ? WHERE student_id = ?");
$update->bind_param("si", $barcodePath, $student_id);
$update->execute();
$update->close();

$conn->close();

// Success message and redirect
echo "<script>
alert('Registration successful! Your QR code has been generated.');
window.location.href = 'login.html';
</script>";
exit;
?>
