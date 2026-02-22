<?php
$db = new SQLite3("users.db");

$FLAG = "FLAG{sql_master}";

$mode = $_POST["mode"] ?? "vulnerable";
$username = $_POST["username"] ?? "";
$password = $_POST["password"] ?? "";
$difficulty = $_POST["difficulty"] ?? "easy";

$message = "";
$queryUsed = "";
$status = "vulnerable";
$output = "";
$flagReveal = null;

$db->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
)");

$db->exec("INSERT OR IGNORE INTO users VALUES (1,'admin','password')");

$db->exec("CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY,
    attempts INTEGER,
    successes INTEGER
)");
$db->exec("INSERT OR IGNORE INTO stats VALUES (1,0,0)");

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $db->exec("UPDATE stats SET attempts = attempts + 1 WHERE id=1");

    if ($mode === "vulnerable") {

        if ($difficulty === "hard") {
            $username = SQLite3::escapeString($username);
            $password = SQLite3::escapeString($password);
        }

        if ($difficulty === "medium") {
            $username = str_replace(["--", ";"], "", $username);
            $password = str_replace(["--", ";"], "", $password);
        }

        $queryUsed =
            "SELECT * FROM users WHERE username = '$username' AND password = '$password'";

        $result = @$db->query($queryUsed);

        if ($result && $result->fetchArray()) {
            $status = "success";
            $message = "🎯 Injection Successful!";
            $flagReveal = $FLAG;
            $output = "Authentication bypassed.\nAdmin session granted.\n\n🚩 $FLAG";
            $db->exec("UPDATE stats SET successes = successes + 1 WHERE id=1");
        } else {
            $message = "Invalid credentials.";
            $output = "Query executed.\nNo matching records found.";
        }

    } else {

        $stmt = $db->prepare("SELECT * FROM users WHERE username = :u AND password = :p");
        $stmt->bindValue(":u", $username, SQLITE3_TEXT);
        $stmt->bindValue(":p", $password, SQLITE3_TEXT);
        $result = $stmt->execute();

        if ($result && $result->fetchArray()) {
            $status = "secure";
            $message = "Login successful (secure mode)";
            $output = "Prepared statements used.\nInjection prevented.";
        } else {
            $status = "secure";
            $message = "Injection blocked.";
            $output = "Input treated as data.\nNo SQL manipulation allowed.";
        }
    }
}

$stats = $db->querySingle("SELECT attempts || ',' || successes FROM stats");
[$attempts, $successes] = explode(",", $stats);
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>SQL Injection Lab</title>
<style>

body {
    background:#020617;
    color:#e5e7eb;
    font-family:system-ui;
    margin:0;
    padding:40px;
}

.container {
    max-width:1200px;
    margin:auto;
}

h1 {
    font-size:28px;
    margin-bottom:6px;
}

.subtitle {
    color:#94a3b8;
    margin-bottom:30px;
}

.grid {
    display:grid;
    grid-template-columns:2fr 1fr;
    gap:24px;
}

.card {
    background:#0d1238;
    border:1px solid #1e293b;
    border-radius:16px;
    padding:24px;
}

.section-title {
    font-size:18px;
    margin-bottom:20px;
}

label {
    display:block;
    margin-top:12px;
    font-size:14px;
    color:#cbd5e1;
}

input, select {
    width:100%;
    padding:12px;
    margin-top:6px;
    border-radius:10px;
    border:1px solid #334155;
    background:#0a0e27;
    color:#e5e7eb;
}

input:focus, select:focus {
    outline:none;
    border-color:#3b82f6;
    box-shadow:0 0 10px rgba(59,130,246,.3);
}

button {
    margin-top:18px;
    width:100%;
    padding:12px;
    border-radius:10px;
    border:none;
    font-weight:bold;
    cursor:pointer;
    background:#2563eb;
    color:white;
}

button:hover {
    background:#1d4ed8;
}

.output-box {
    background:#0a0e27;
    border:1px solid #334155;
    border-radius:12px;
    padding:16px;
    font-family:monospace;
    min-height:200px;
    white-space:pre-wrap;
}

.flag-box {
    margin-top:16px;
    padding:16px;
    border-radius:12px;
    background:#0f172a;
    border:1px solid #22c55e;
    color:#22c55e;
    font-weight:bold;
    text-align:center;
    box-shadow:0 0 20px rgba(34,197,94,.5);
}

.info-box p {
    margin:8px 0;
    font-size:14px;
}

.payload {
    background:#0a0e27;
    padding:12px;
    border-radius:10px;
    border:1px solid #334155;
    margin-top:10px;
    font-family:monospace;
    font-size:13px;
}

.status-success { color:#22c55e; }
.status-secure { color:#3b82f6; }
.status-vulnerable { color:#f59e0b; }

</style>
</head>
<body>

<div class="container">

<h1>Basic SQL Injection</h1>
<p class="subtitle">Practice authentication bypass in a controlled environment.</p>

<div class="grid">

<div>

<div class="card">
<h2 class="section-title">Lab Configuration</h2>

<form method="POST">

<label>Mode</label>
<select name="mode">
<option value="vulnerable" <?= $mode==="vulnerable"?"selected":"" ?>>Vulnerable</option>
<option value="secure" <?= $mode==="secure"?"selected":"" ?>>Secure</option>
</select>

<label>Difficulty</label>
<select name="difficulty">
<option value="easy" <?= $difficulty==="easy"?"selected":"" ?>>Easy</option>
<option value="medium" <?= $difficulty==="medium"?"selected":"" ?>>Medium</option>
<option value="hard" <?= $difficulty==="hard"?"selected":"" ?>>Hard</option>
</select>

<label>Username</label>
<input name="username" value="<?= htmlspecialchars($username) ?>">

<label>Password</label>
<input name="password" value="<?= htmlspecialchars($password) ?>">

<button>Execute</button>
</form>
</div>

<div class="card" style="margin-top:24px;">
<h2 class="section-title">Output</h2>

<div class="output-box">
<?= $output ? htmlspecialchars($output) : "Output will appear here after execution..." ?>
</div>

<?php if ($flagReveal): ?>
<div class="flag-box">
🚩 <?= htmlspecialchars($flagReveal) ?>
</div>
<?php endif; ?>

<?php if ($queryUsed): ?>
<div class="payload">
<strong>Executed Query:</strong><br>
<?= htmlspecialchars($queryUsed) ?>
</div>
<?php endif; ?>

</div>

</div>

<div>

<div class="card">
<h2 class="section-title">Lab Info</h2>
<div class="info-box">
<p><strong>Category:</strong> Database</p>
<p><strong>Type:</strong> Authentication Bypass</p>
<p><strong>Attempts:</strong> <?= $attempts ?></p>
<p><strong>Successes:</strong> <?= $successes ?></p>
<p><strong>Status:</strong> 
<span class="status-<?= $status ?>">
<?= ucfirst($status) ?>
</span>
</p>
</div>
</div>

<div class="card" style="margin-top:24px;">
<h2 class="section-title">Payload Guide</h2>

<div class="payload">
Basic Payload:<br>
' OR '1'='1
</div>

<div class="payload">
Advanced Payload:<br>
' UNION SELECT NULL--
</div>

<p style="margin-top:12px;color:#94a3b8;font-size:13px;">
Toggle between vulnerable and secure mode to understand how prepared statements prevent injection.
</p>

</div>

</div>

</div>
</div>

</body>
</html>