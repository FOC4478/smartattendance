<?php
include 'db_connect.php'; 

// Default admin details
$email = 'admin@gmail.com';
$plain_password = '12345'; // change as needed
$full_name = 'System Administrator';

// Hash the password
$hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

try {
    // Check if admin already exists
    $check = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        echo "⚠️ Admin with email $email already exists.";
        exit;
    }

    // Insert admin into database
    $stmt = $pdo->prepare("INSERT INTO admins (email, password, full_name) VALUES (?, ?, ?)");
    $stmt->execute([$email, $hashed_password, $full_name]);

    echo "✅ Admin account created successfully!<br>";
    echo "Email: $email<br>Password: $plain_password (hashed in DB)";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>


