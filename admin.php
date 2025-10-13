<?php
include 'db_connect.php';

// Admin details
$email = 'admin@gmail.com';
$plain_password = '12345'; // you can change this
$full_name = 'System Administrator';

// Hash the password
$hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

// Insert into database
$sql = "INSERT INTO admin (username, password, full_name) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $username, $hashed_password, $full_name);

if ($stmt->execute()) {
    echo "✅ Admin account created successfully!<br>";
    echo "Username: $username<br>Password: $plain_password (hashed in DB)";
} else {
    echo "❌ Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
