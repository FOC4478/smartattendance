<?php
session_start();
include 'db_connect.php';

$student_id = $_SESSION['student_id'] ?? 1; 

// Fetch student info
$stmt = $conn->prepare("SELECT * FROM students WHERE student_id = ?");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$student = $stmt->get_result()->fetch_assoc();

// Attendance metrics
$total_days = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE student_id = $student_id")->fetch_assoc()['count'];
$present = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE student_id = $student_id AND status='present'")->fetch_assoc()['count'];
$absent = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE student_id = $student_id AND status='absent'")->fetch_assoc()['count'];
$attendance_percent = $total_days > 0 ? round(($present/$total_days)*100, 2) : 0;

// Calendar data
$year = date('Y');
$month = date('m');
$days_in_month = cal_days_in_month(CAL_GREGORIAN, $month, $year);
$calendar = [];

for ($d = 1; $d <= $days_in_month; $d++) {
    $date = "$year-$month-" . str_pad($d, 2, '0', STR_PAD_LEFT);
    $status = $conn->query("SELECT status FROM attendance WHERE student_id=$student_id AND date_marked='$date'")->fetch_assoc()['status'] ?? 'none';
    $calendar[$d] = $status;
}

// Chart data
$statuses = array_values($calendar);
$chart_data = [
    'labels' => array_map(fn($d) => (string)$d, array_keys($calendar)),
    'present' => array_map(fn($s) => $s==='present'?1:0, $statuses),
    'absent' => array_map(fn($s) => $s==='absent'?1:0, $statuses)
];

// Output JSON
header('Content-Type: application/json');
echo json_encode([
    'student' => $student,
    'attendance_percent' => $attendance_percent,
    'present' => $present,
    'absent' => $absent,
    'calendar' => $calendar,
    'chart' => $chart_data,
    'year' => $year,
    'month' => $month
]);
?>
