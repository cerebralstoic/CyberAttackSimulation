<?php
$mode = $_GET["mode"] ?? "vulnerable";
$difficulty = $_GET["difficulty"] ?? "easy";
$host = $_GET["host"] ?? "";

$FLAG = "FLAG{cmdi_shell_access}";
$flagReveal = null;

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


  if (
      $mode === "vulnerable" &&
      $difficulty === "easy" &&
      (strpos($_GET["host"] ?? "", ";") !== false ||
       strpos($_GET["host"] ?? "", "&&") !== false ||
       strpos($_GET["host"] ?? "", "|") !== false)
  ) {
      $flagReveal = $FLAG;
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
    margin:0;
    padding:40px;
}
.container { max-width:1200px; margin:auto; }

.header { margin-bottom:30px; }
.header h1 { font-size:28px; margin-bottom:6px; }
.subtitle { color:#94a3b8; }

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

.section-title { font-size:18px; margin-bottom:20px; }

label {
    font-size:14px;
    color:#cbd5e1;
    display:block;
    margin-bottom:6px;
}

select, input {
    width:100%;
    padding:12px;
    border-radius:10px;
    border:1px solid #334155;
    background:#0a0e27;
    color:#e5e7eb;
    margin-bottom:14px;
}

.input-row {
    display:flex;
    gap:12px;
}

.input-row input {
    flex:1;
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

.execute-btn:hover { background:#1d4ed8; }

.output-box {
    background:#0a0e27;
    border:1px solid #334155;
    border-radius:12px;
    padding:16px;
    font-family:monospace;
    white-space:pre-wrap;
    min-height:120px;
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
<h1>💥 Command Injection Lab</h1>
<p class="subtitle">Test host input against system command execution.</p>
</div>

<div class="grid">

<div>

<div class="card">
<h2 class="section-title">Lab Configuration</h2>

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

<label>Target Host</label>
<div class="input-row">
<input name="host" placeholder="8.8.8.8">
<button class="execute-btn">Execute</button>
</div>

</form>
</div>

<div class="card" style="margin-top:24px;">
<h2 class="section-title">Execution Result</h2>

<?php if ($executedCommand): ?>
<div class="output-box">
<strong>Executed Command:</strong>
<?= htmlspecialchars($executedCommand) ?>
</div>
<?php endif; ?>

<?php if ($output): ?>
<div class="output-box" style="margin-top:16px;">
<strong>Output:</strong>
<?= htmlspecialchars($output) ?>
</div>
<?php endif; ?>

<?php if ($flagReveal): ?>
<div class="flag-box">
🚩 <?= htmlspecialchars($flagReveal) ?>
</div>
<?php endif; ?>

</div>

</div>

<div>

<div class="card">
<h2 class="section-title">Lab Info</h2>
<p><strong>Category:</strong> Injection</p>
<p><strong>Type:</strong> Command Injection</p>
<p><strong>Execution:</strong> shell_exec()</p>
</div>

<div class="card" style="margin-top:24px;">
<h2 class="section-title">Payload Guide</h2>

<div class="payload">
Basic:<br>
8.8.8.8; ls
</div>

<div class="payload">
Advanced:<br>
8.8.8.8 && whoami
</div>

</div>

</div>

</div>

</div>

</body>
</html>