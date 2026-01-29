<?php
$mode = $_POST["mode"] ?? "vulnerable";
$difficulty = $_POST["difficulty"] ?? "easy";
$input = $_POST["input"] ?? "";

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
</style>
</head>
<body>
<div class="container">
<h1>🧨 XSS Lab</h1>

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

<label>Input</label>
<input name="input" placeholder="<script>alert(1)</script>">

<button>Submit</button>
</form>

<?php if ($output): ?>
<div class="box">
<strong>Rendered Output:</strong><br>
<?= $output ?>
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
