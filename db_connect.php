<?php
$host = 'blqdfarata3zapjyv6yn-mysql.services.clever-cloud.com';
$user = 'udoawlwkfiuin9o3';
$pass = '4DpuR2VCtxbLgj9hYfzw';
$db   = 'blqdfarata3zapjyv6yn';
$port = 3306;
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}