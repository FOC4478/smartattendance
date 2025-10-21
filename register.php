<?php
// register.php
session_start();
include 'db_connect.php'; // ensure this file exists and connects to ateendances DB

function js_alert_and_back($msg) {
    echo "<script>alert(" . json_encode($msg) . "); window.history.back();</script>";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: register.html");
    exit;
}

// Collect & sanitize
$full_name  = isset($_POST['full_name']) ? trim($_POST['full_name']) : '';
$matric_no  = isset($_POST['matric_no']) ? trim($_POST['matric_no']) : '';
$department = isset($_POST['department']) ? trim($_POST['department']) : null;
$level      = isset($_POST['level']) ? trim($_POST['level']) : null;
$email      = isset($_POST['email']) ? trim($_POST['email']) : '';
$password   = isset($_POST['password']) ? $_POST['password'] : '';
$confirm    = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

// Basic validation
if (empty($full_name) || empty($matric_no) || empty($email) || empty($password)) {
    js_alert_and_back('Please fill in all required fields.');
}

if ($password !== $confirm) {
    js_alert_and_back('Passwords do not match.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    js_alert_and_back('Invalid email address.');
}

// Check existing matric_no or email
$checkSql = "SELECT student_id FROM students WHERE matric_no = ? OR email = ? LIMIT 1";
if ($stmt = $conn->prepare($checkSql)) {
    $stmt->bind_param("ss", $matric_no, $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        $stmt->close();
        js_alert_and_back('A user with that matric number or email already exists.');
    }
    $stmt->close();
} else {
    js_alert_and_back('Database error: failed to prepare statement.');
}

// Hash password
$hashed = password_hash($password, PASSWORD_DEFAULT);

// Generate unique barcode (example: BC + 8 hex chars)
function generate_barcode($conn) {
    // ensure uniqueness quickly
    for ($i=0; $i<6; $i++) {
        $barcode = 'BC' . strtoupper(bin2hex(random_bytes(4))); // e.g. BC7F3A1C9D...
        // check uniqueness
        $q = "SELECT student_id FROM students WHERE barcode = ? LIMIT 1";
        if ($st = $conn->prepare($q)) {
            $st->bind_param("s", $barcode);
            $st->execute();
            $st->store_result();
            if ($st->num_rows === 0) {
                $st->close();
                return $barcode;
            }
            $st->close();
        }
    }
    // fallback
    return 'BC' . uniqid();
}

$barcodeValue = generate_barcode($conn);

// Handle photo upload (optional)
$photo_filename = null;
if (isset($_FILES['photo']) && $_FILES['photo']['error'] !== UPLOAD_ERR_NO_FILE) {
    $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $file = $_FILES['photo'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        js_alert_and_back('Error uploading photo.');
    }

    // basic validation
    $allowed = ['image/jpeg','image/png','image/gif','image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime, $allowed)) {
        js_alert_and_back('Invalid photo type. Use JPG, PNG, GIF or WEBP.');
    }

    // unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $photo_filename = 'photo_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $destination = $uploadDir . DIRECTORY_SEPARATOR . $photo_filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        js_alert_and_back('Failed to save uploaded photo.');
    }
}

// Insert into students table (columns match your DB)
$insertSql = "INSERT INTO students (full_name, matric_no, department, level, email, password, barcode, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
if ($ins = $conn->prepare($insertSql)) {
    // use null for department/level if empty
    $dep = $department ?: null;
    $lev = $level ?: null;
    // bind (s = string)
    $ins->bind_param("ssssssss", $full_name, $matric_no, $dep, $lev, $email, $hashed, $barcodeValue, $photo_filename);
    if ($ins->execute()) {
        // success -> redirect to login with success message
        // show alert then redirect
        $ins->close();
        $conn->close();
        echo "<script>alert('Registration successful. Your barcode: " . htmlspecialchars($barcodeValue, ENT_QUOTES) . "'); window.location.href='login.html';</script>";
        exit;
    } else {
        $ins->close();
        $conn->close();
        js_alert_and_back('Failed to register. Try again later.');
    }
} else {
    js_alert_and_back('Database error: failed to prepare insert.');
}
