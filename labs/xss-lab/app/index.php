<?php
$mode = $_POST["mode"] ?? "vulnerable";
$difficulty = $_POST["difficulty"] ?? "easy";
$input = $_POST["input"] ?? "";

$FLAG = "FLAG{xss_hunter}";
$flagReveal = null;

$output = "";
$status = "vulnerable";
$explanation = "";

function explainXSS($input, $mode, $difficulty) {
    $i = strtolower($input);

    if ($mode === "secure") {
        return "Output is HTML-escaped. Browser treats input as text, not executable code.";
    }

    if (strpos($i, "<script") !== false || strpos($i, "onerror") !== false) {
        if ($difficulty === "hard") {
            return "XSS payload detected but neutralized by strong output encoding.";
        }
        return "Reflected XSS detected. Malicious script is injected into the HTML response and executed by the browser.";
    }

    if (strpos($i, "<") !== false || strpos($i, ">") !== false) {
        return "HTML injection attempt detected. Angle brackets indicate markup injection.";
    }

    return "No XSS pattern detected.";
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if ($mode === "vulnerable") {

        if ($difficulty === "medium") {
            $input = str_replace(["<script", "</script>"], "", $input);
        }

        if ($difficulty === "hard") {
            $input = htmlspecialchars($input, ENT_QUOTES, "UTF-8");
        }

        $output = $input;
        $status = ($difficulty === "easy") ? "success" : "vulnerable";

    } else {
        $output = htmlspecialchars($input, ENT_QUOTES, "UTF-8");
        $status = "secure";
    }

    $explanation = explainXSS($input, $mode, $difficulty);

   
    if ($status === "success") {
        $flagReveal = $FLAG;
    }
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>XSS Lab</title>
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

select {
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
    padding:14px;
    border-radius:10px;
    border:1px solid #334155;
    background:#0a0e27;
    color:#e5e7eb;
}

.input-row input:focus {
    outline:none;
    border-color:#3b82f6;
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
    min-height:150px;
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

.side-box p {
    font-size:14px;
    margin:6px 0;
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
<h1>🧨 Reflected XSS Lab</h1>
<p class="subtitle">Experiment with payloads and observe browser execution behavior.</p>
</div>
<div style="margin-bottom:30px; border-bottom:1px solid #1e293b;">
  <div style="display:flex; gap:20px;">

    <a href="index.php"
       style="padding:12px 0; font-weight:600; color:#60a5fa; border-bottom:2px solid #3b82f6; text-decoration:none;">
       Reflected XSS
    </a>

    <a href="dom.html"
       style="padding:12px 0; color:#94a3b8; text-decoration:none;">
       DOM XSS
    </a>

    <a href="stored.php"
       style="padding:12px 0; color:#94a3b8; text-decoration:none;">
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
<option value="easy" <?= $difficulty==="easy"?"selected":"" ?>>Easy</option>
<option value="medium" <?= $difficulty==="medium"?"selected":"" ?>>Medium</option>
<option value="hard" <?= $difficulty==="hard"?"selected":"" ?>>Hard</option>
</select>

<label>Test Payload</label>
<div class="input-row">
<input name="input"
       value="<?= htmlspecialchars($input) ?>"
       placeholder="Enter test payload...">
<button class="execute-btn">Execute</button>
</div>

</form>
</div>

<div class="card" style="margin-top:24px;">
<h2 class="section-title">Output</h2>

<div class="output-box">
<?= $output ? $output : "Output will appear here after execution..." ?>
</div>

<?php if ($flagReveal): ?>
<div class="flag-box">
🚩 <?= htmlspecialchars($flagReveal) ?>
</div>
<?php endif; ?>

</div>

</div>

<div>

<div class="card side-box">
<h2 class="section-title">Lab Info</h2>
<p><strong>Category:</strong> Cross-Site Scripting</p>
<p><strong>Type:</strong> Reflected XSS</p>
<p><strong>Status:</strong> <?= ucfirst($status) ?></p>
</div>

<div class="card" style="margin-top:24px;">
<h2 class="section-title">Payload Guide</h2>

<div class="payload">
Basic:<br>
&lt;script&gt;alert(1)&lt;/script&gt;
</div>

<div class="payload">
Advanced:<br>
&lt;img src=x onerror=alert(1)&gt;
</div>

</div>

</div>

</div>

<?php if ($explanation): ?>
<div class="card" style="margin-top:24px;">
<h2 class="section-title">Payload Analysis</h2>
<div class="output-box">
<?= htmlspecialchars($explanation) ?>
</div>
</div>
<?php endif; ?>

</div>
</body>
</html>