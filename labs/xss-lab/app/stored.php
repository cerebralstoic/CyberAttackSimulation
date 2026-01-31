<?php
$db = new SQLite3("stored.db");

$db->exec("CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT
)");

$mode = $_POST["mode"] ?? "vulnerable";
$difficulty = $_POST["difficulty"] ?? "easy";
$input = $_POST["comment"] ?? "";

$status = "vulnerable";
$message = "";
$explanation = "";

function explainStoredXSS($input, $mode, $difficulty) {
  $i = strtolower($input);

  if ($mode === "secure") {
    return "Stored XSS prevented by output encoding. Stored data is rendered as text, not executable HTML.";
  }

  if (strpos($i, "<script") !== false || strpos($i, "onerror") !== false || strpos($i, "onload") !== false) {
    if ($difficulty === "hard") {
      return "Stored XSS payload detected but neutralized by strong HTML encoding.";
    }
    return "Stored XSS detected. Malicious input was saved and later executed when rendered.";
  }

  return "No obvious XSS payload detected.";
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

  if ($mode === "vulnerable") {

    if ($difficulty === "medium") {
      $input = preg_replace("/<script/i", "", $input);
    }

    if ($difficulty === "hard") {
      $input = htmlspecialchars($input, ENT_QUOTES, "UTF-8");
    }

    $stmt = $db->prepare("INSERT INTO comments (content) VALUES (:c)");
    $stmt->bindValue(":c", $input, SQLITE3_TEXT);
    $stmt->execute();

    $status = ($difficulty === "easy") ? "success" : "vulnerable";
    $message = "Comment stored";
  } else {

    $safe = htmlspecialchars($input, ENT_QUOTES, "UTF-8");

    $stmt = $db->prepare("INSERT INTO comments (content) VALUES (:c)");
    $stmt->bindValue(":c", $safe, SQLITE3_TEXT);
    $stmt->execute();

    $status = "secure";
    $message = "Comment stored safely";
  }

  $explanation = explainStoredXSS($input, $mode, $difficulty);
}

$comments = $db->query("SELECT content FROM comments ORDER BY id DESC");
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Stored XSS Lab</title>
<style>
body {
  background:#020617;
  color:#e5e7eb;
  font-family:system-ui;
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
h1 { text-align:center; color:#60a5fa; }

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
textarea, select, button {
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
.comment {
  padding:8px;
  margin-top:8px;
  border:1px solid #334155;
  border-radius:6px;
}
</style>
</head>
<body>
<div class="container">
<h1>🧨 Stored XSS Lab</h1>

<div class="status-ball <?= $status ?>"></div>

<div class="box">
  <a href="/" style="color:#60a5fa">Reflected</a> |
  <a href="/dom.html" style="color:#60a5fa">DOM</a> |
  <strong>Stored</strong>
</div>

<form method="POST">
<label>Mode</label>
<select name="mode">
  <option value="vulnerable" <?= $mode==="vulnerable"?"selected":"" ?>>Vulnerable</option>
  <option value="secure" <?= $mode==="secure"?"selected":"" ?>>Secure</option>
</select>

<label>Difficulty</label>
<select name="difficulty">
  <option value="easy">Easy</option>
  <option value="medium">Medium</option>
  <option value="hard">Hard</option>
</select>

<label>Comment</label>
<textarea name="comment" placeholder="<script>alert('stored')</script>"></textarea>

<button>Post Comment</button>
</form>

<?php if ($message): ?>
<div class="box"><?= htmlspecialchars($message) ?></div>
<?php endif; ?>

<?php if ($explanation): ?>
<div class="box"><strong>Payload Analysis:</strong><br><?= htmlspecialchars($explanation) ?></div>
<?php endif; ?>

<h3 style="margin-top:16px">Comments</h3>

<?php while ($row = $comments->fetchArray()): ?>
<div class="comment"><?= $row["content"] ?></div>
<?php endwhile; ?>

</div>
</body>
</html>
