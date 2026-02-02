<?php
$mode = $_GET["mode"] ?? "vulnerable";
$difficulty = $_GET["difficulty"] ?? "easy";
$host = $_GET["host"] ?? "";

$output = "";
$executedCommand = "";

if ($host !== "") {

  if ($mode === "secure") {
    $safeHost = escapeshellarg($host);
    $executedCommand = "ping -c 1 " . $safeHost;
    $output = shell_exec($executedCommand);
  } else {

    if ($difficulty === "medium") {
      $host = str_replace([";", "&&", "|"], "", $host);
    }

    if ($difficulty === "hard") {
      $host = escapeshellarg($host);
    }

    $executedCommand = "ping -c 1 " . $host;
    $output = shell_exec($executedCommand);
  }
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Command Injection Lab</title>
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
  width:460px;
  padding:24px;
  background:#020617;
  border:1px solid #1e293b;
  border-radius:14px;
  box-shadow:0 0 40px rgba(37,99,235,.15);
}
h1 { text-align:center; color:#60a5fa; }
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
pre {
  background:#020617;
  border:1px dashed #334155;
  padding:10px;
  margin-top:12px;
  border-radius:8px;
  white-space:pre-wrap;
}
</style>
</head>
<body>
<div class="container">
<h1>🧨 Command Injection Lab</h1>

<form method="GET">
<label>Mode</label>
<select name="mode">
  <option value="vulnerable">Vulnerable</option>
  <option value="secure">Secure</option>
</select>

<label>Difficulty</label>
<select name="difficulty">
  <option value="easy">Easy</option>
  <option value="medium">Medium</option>
  <option value="hard">Hard</option>
</select>

<label>Host</label>
<input name="host" placeholder="8.8.8.8">

<button>Run</button>
</form>

<?php if ($executedCommand): ?>
<pre><strong>Executed Command:</strong>
<?= htmlspecialchars($executedCommand) ?></pre>
<?php endif; ?>

<?php if ($output): ?>
<pre><strong>Output:</strong>
<?= htmlspecialchars($output) ?></pre>
<?php endif; ?>

</div>
</body>
</html>
