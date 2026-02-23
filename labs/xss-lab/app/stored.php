<?php
$db = new SQLite3("stored.db");

$db->exec("CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT
)");

$mode = $_POST["mode"] ?? "vulnerable";
$difficulty = $_POST["difficulty"] ?? "easy";
$input = $_POST["comment"] ?? "";

$FLAG = "FLAG{xss_hunter}";
$flagReveal = null;

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

  if ($status === "success") {
      $flagReveal = $FLAG;
  }
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
    margin:0;
    padding:40px;
}
.container {
    max-width:1200px;
    margin:auto;
}
.header {
    margin-bottom:30px;
}
.header h1 {
    font-size:28px;
    margin-bottom:6px;
}
.subtitle {
    color:#94a3b8;
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
    font-size:14px;
    color:#cbd5e1;
    display:block;
    margin-bottom:6px;
}
select, textarea {
    width:100%;
    padding:12px;
    border-radius:10px;
    border:1px solid #334155;
    background:#0a0e27;
    color:#e5e7eb;
    margin-bottom:14px;
}
textarea {
    min-height:100px;
}
.execute-btn {
    padding:14px 22px;
    border-radius:10px;
    border:none;
    background:#2563eb;
    color:white;
    cursor:pointer;
    font-weight:600;
}
.execute-btn:hover {
    background:#1d4ed8;
}
.output-box {
    background:#0a0e27;
    border:1px solid #334155;
    border-radius:12px;
    padding:16px;
    font-family:monospace;
    white-space:pre-wrap;
}
.flag-box {
    margin-top:16px;
    padding:18px;
    border-radius:14px;
    background:#0f172a;
    border:1px solid #22c55e;
    color:#22c55e;
    font-weight:bold;
    text-align:center;
    box-shadow:0 0 20px rgba(34,197,94,.4);
}
.comment {
    padding:10px;
    margin-top:10px;
    border:1px solid #334155;
    border-radius:8px;
    background:#0a0e27;
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
</style>
</head>
<body>

<div class="container">

<div class="header">
<h1>🧨 Stored XSS Lab</h1>
<p class="subtitle">Persist malicious payloads and observe execution upon rendering.</p>
</div>
<div style="margin-bottom:30px; border-bottom:1px solid #1e293b;">
  <div style="display:flex; gap:20px;">

    <a href="index.php"
       style="padding:12px 0; color:#94a3b8; text-decoration:none;">
       Reflected XSS
    </a>

    <a href="dom.html"
       style="padding:12px 0; color:#94a3b8; text-decoration:none;">
       DOM XSS
    </a>

    <a href="stored.php"
       style="padding:12px 0; font-weight:600; color:#60a5fa; border-bottom:2px solid #3b82f6; text-decoration:none;">
       Stored XSS
    </a>

  </div>
</div>
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
  <option value="easy">Easy</option>
  <option value="medium">Medium</option>
  <option value="hard">Hard</option>
</select>

<label>Comment Payload</label>
<textarea name="comment" placeholder="Enter stored XSS payload..."></textarea>

<button class="execute-btn">Post Comment</button>

</form>

<?php if ($message): ?>
<div class="output-box" style="margin-top:16px;">
<?= htmlspecialchars($message) ?>
</div>
<?php endif; ?>

<?php if ($flagReveal): ?>
<div class="flag-box">
🚩 <?= htmlspecialchars($flagReveal) ?>
</div>
<?php endif; ?>

<?php if ($explanation): ?>
<div class="output-box" style="margin-top:16px;">
<strong>Payload Analysis:</strong><br>
<?= htmlspecialchars($explanation) ?>
</div>
<?php endif; ?>

</div>

<div class="card" style="margin-top:24px;">
<h2 class="section-title">Stored Comments</h2>

<?php while ($row = $comments->fetchArray()): ?>
<div class="comment"><?= $row["content"] ?></div>
<?php endwhile; ?>

</div>

</div>

<div>

<div class="card">
<h2 class="section-title">Lab Info</h2>
<p><strong>Category:</strong> Cross-Site Scripting</p>
<p><strong>Type:</strong> Stored XSS</p>
<p><strong>Status:</strong> <?= ucfirst($status) ?></p>
</div>

<div class="card" style="margin-top:24px;">
<h2 class="section-title">Payload Guide</h2>

<div class="payload">
Basic:<br>
&lt;script&gt;alert('stored')&lt;/script&gt;
</div>

<div class="payload">
Advanced:<br>
&lt;img src=x onerror=alert(1)&gt;
</div>

</div>

</div>

</div>

</div>
</body>
</html>