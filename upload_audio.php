<?php
header('Content-Type: application/json');

// 确保请求方法是POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => '方法不允许']);
    exit;
}

// 检查是否有文件上传
if (!isset($_FILES['audio'])) {
    http_response_code(400);
    echo json_encode(['error' => '没有文件上传']);
    exit;
}

$file = $_FILES['audio'];

// 检查文件类型
$allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => '不支持的文件类型']);
    exit;
}

// 检查文件大小（5MB限制）
if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => '文件大小超过限制']);
    exit;
}

// 创建上传目录（如果不存在）
$uploadDir = 'uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// 生成唯一的文件名
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid() . '.' . $extension;
$filepath = $uploadDir . $filename;

// 移动文件到目标位置
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    echo json_encode([
        'success' => true,
        'filepath' => $filepath,
        'type' => $file['type']
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => '文件上传失败']);
}
?> 