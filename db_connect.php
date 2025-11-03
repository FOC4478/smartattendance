<?php
$host = 'blqdfarata3zapjyv6yn-mysql.services.clever-cloud.com';
$user = 'udoawlwkfiuin9o3';
$pass = '4DpuR2VCtxbLgj9hYfzw';
$db   = 'blqdfarata3zapjyv6yn';
$port = 3306;

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// echo "Database connected successfully!";
?>


 