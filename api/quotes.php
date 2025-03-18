<?php
header('Content-Type: application/json');

// 设置允许跨域请求
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 如果是OPTIONS请求（预检请求），直接返回200
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 数据文件路径
$dataFile = '../data/quotes.json';

// 确保data目录存在
if (!file_exists('../data')) {
    mkdir('../data', 0777, true);
}

// 获取名言数据
function getQuotes() {
    global $dataFile;
    
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        return json_decode($content, true) ?: [];
    }
    
    // 默认名言数据
    return [
        [
            'id' => 1,
            'text' => '<span class="first-letter">生</span>活中最重要的事情是确定一个伟大的目标，并决心实现它。',
            'source' => '歌德'
        ],
        [
            'id' => 2,
            'text' => '<span class="first-letter">成</span>功不是将来才有的，而是从决定去做的那一刻起，持续累积而成。',
            'source' => '佚名'
        ],
        [
            'id' => 3,
            'text' => '<span class="first-letter">当</span>你感到悲伤时，最好是去学些什么东西。学习会使你永远立于不败之地。',
            'source' => '居里夫人'
        ],
        [
            'id' => 4,
            'text' => '<span class="first-letter">世</span>界上那些最容易的事情中，拖延时间最不费力。',
            'source' => '克雷洛夫'
        ],
        [
            'id' => 5,
            'text' => '<span class="first-letter">人</span>生就像骑单车，想保持平衡就得往前走。',
            'source' => '爱因斯坦'
        ]
    ];
}

// 保存名言数据
function saveQuotes($quotes) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($quotes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

// 处理GET请求 - 获取名言
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $quotes = getQuotes();
    echo json_encode(['success' => true, 'quotes' => $quotes], JSON_UNESCAPED_UNICODE);
    exit;
}

// 处理POST请求 - 保存名言
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['quotes'])) {
        http_response_code(400);
        echo json_encode(['error' => '无效的数据格式']);
        exit;
    }
    
    saveQuotes($data['quotes']);
    echo json_encode(['success' => true]);
    exit;
}

// 如果不是GET或POST请求，返回405
http_response_code(405);
echo json_encode(['error' => '方法不允许']);