<?php
$db = new SQLite3("users.db");

$mode = $_POST["mode"] ?? "vulnerable";
$username = $_POST["username"] ?? "";
$password = $_POST["password"] ?? "";
$explanation = "";
$difficulty = $_POST["difficulty"] ?? "easy";

$message = "";
$queryUsed = "";
$status = "vulnerable";

$db->exec("CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY,
    attempts INTEGER,
    successes INTEGER
)");
$db->exec("INSERT OR IGNORE INTO stats VALUES (1,0,0)");
function explainPayload($username, $password, $difficulty, $mode) {
    $input = strtolower($username . " " . $password);

    if ($mode === "secure") {
        return "Prepared statements are used. User input is treated as data, not SQL code, so injection is blocked.";
    }

    if (strpos($input, " or ") !== false || strpos($input, "1=1") !== false) {
        if ($difficulty === "hard") {
            return "Boolean-based SQL injection was attempted, but input was escaped, preventing query manipulation.";
        }
        return "Boolean-based SQL injection detected. The injected condition forces the WHERE clause to always evaluate TRUE.";
    }

    if (strpos($input, "--") !== false) {
        if ($difficulty === "medium" || $difficulty === "hard") {
            return "Comment-based SQL injection was attempted, but comment tokens are filtered in this difficulty level.";
        }
        return "Comment-based SQL injection detected. The rest of the SQL query is commented out, bypassing authentication.";
    }

    if (strpos($input, "'") !== false) {
        return "Quote-based SQL injection attempt detected. The attacker tried to break out of the string context.";
    }

    return "No SQL injection pattern detected. Authentication failed due to invalid credentials.";
}

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
            "SELECT * FROM users WHERE " .
            "username = '$username' AND password = '$password'";

        $result = @$db->query($queryUsed);

        if ($result && $result->fetchArray()) {
            $message = "Login successful";
            $status = ($difficulty === "easy") ? "success" : "vulnerable";
            $db->exec("UPDATE stats SET successes = successes + 1 WHERE id=1");
        } else {
            $message = "Invalid credentials";
        }

    } else {

        $stmt = $db->prepare("SELECT * FROM users WHERE username = :u AND password = :p");
        $stmt->bindValue(":u", $username, SQLITE3_TEXT);
        $stmt->bindValue(":p", $password, SQLITE3_TEXT);
        $result = $stmt->execute();

        if ($result && $result->fetchArray()) {
            $message = "Login successful (secure mode)";
            $status = "secure";
        } else {
            $message = "Injection blocked (prepared statements)";
            $status = "secure";
        }
    }
}
$explanation = explainPayload($username, $password, $difficulty, $mode);


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
    font-family: system-ui;
    display:flex;
    justify-content:center;
    align-items:center;
    min-height:100vh;
}
.container {
    width:440px;
    padding:24px;
    background:#020617;
    border:1px solid #1e293b;
    border-radius:14px;
    box-shadow:0 0 40px rgba(37,99,235,.15);
}
h1 { text-align:center; color:#60a5fa; margin-bottom:4px; }

.status-ball {
    width:14px;
    height:14px;
    margin:12px auto;
    border-radius:50%;
    animation:pulse 1.8s infinite;
}
.vulnerable { background:#22c55e; box-shadow:0 0 12px #22c55e; }
.secure { background:#3b82f6; box-shadow:0 0 12px #3b82f6; }
.success { background:#ef4444; box-shadow:0 0 14px #ef4444; }

@keyframes pulse {
    0% { transform:scale(.9); opacity:.6 }
    50% { transform:scale(1.2); opacity:1 }
    100% { transform:scale(.9); opacity:.6 }
}

label { font-size:13px; display:block; margin-top:10px }
input, select, button {
    width:100%;
    padding:10px;
    margin-top:4px;
    border-radius:8px;
    border:1px solid #334155;
    background:#020617;
    color:white;
}
button {
    margin-top:14px;
    background:#2563eb;
    border:none;
    cursor:pointer;
}
button:hover { background:#1d4ed8 }

.box {
    margin-top:16px;
    padding:10px;
    font-size:13px;
    border-radius:8px;
    background:#020617;
    border:1px dashed #334155;
    color:#facc15;
}

.stats {
    display:flex;
    justify-content:space-between;
    margin-top:12px;
    font-size:12px;
    color:#94a3b8;
}
</style>
</head>
<body>
<div class="container">
<h1>🔐 SQL Injection Lab</h1>

<div class="status-ball <?= $status ?>"></div>

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
<input name="username" placeholder="admin">

<label>Password</label>
<input name="password" placeholder="password">

<button>Login</button>
</form>

<div class="stats">
<span>Attempts: <?= $attempts ?></span>
<span>SQLi Success: <?= $successes ?></span>
</div>

<?php if ($message): ?>
<div class="box"><?= htmlspecialchars($message) ?></div>
<?php endif; ?>

<?php if ($queryUsed): ?>
<div class="box">
<strong>Executed SQL:</strong><br>
<?= htmlspecialchars($queryUsed) ?>
</div>

<?php endif; ?>

<?php if ($explanation): ?>
<div class="box">
<strong>Payload Analysis:</strong><br>
<?= htmlspecialchars($explanation) ?>
</div>
<?php endif; ?>

</div>
</body>
</html>