<?php
$mode = $_POST["mode"] ?? "vulnerable";
$difficulty = $_POST["difficulty"] ?? "easy";

$FLAG = "FLAG{file_upload_bypass}";
$flagReveal = null;

$message = "";
$status = "vulnerable";

if (!is_dir("uploads")) {
  mkdir("uploads", 0755, true);
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES["file"])) {

  $file = $_FILES["file"];
  $filename = basename($file["name"]);
  $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
  $mime = mime_content_type($file["tmp_name"]);

  if ($mode === "secure") {

    $allowedExt = ["jpg", "png"];
    $allowedMime = ["image/jpeg", "image/png"];

    if (!in_array($ext, $allowedExt) || !in_array($mime, $allowedMime)) {
      $message = "Upload blocked (secure mode)";
      $status = "secure";
    } else {
      $safeName = uniqid("img_") . "." . $ext;
      move_uploaded_file($file["tmp_name"], "uploads/" . $safeName);
      $message = "File uploaded safely";
      $status = "secure";
    }

  } else {

    if ($difficulty === "medium") {

      if ($ext !== "jpg" && $ext !== "png") {
        $message = "Only image extensions allowed";
        $status = "vulnerable";
      } else {
        move_uploaded_file($file["tmp_name"], "uploads/" . $filename);
        $message = "File uploaded";
      }

    } elseif ($difficulty === "hard") {

      if (strpos($mime, "image") === false) {
        $message = "Invalid MIME type";
        $status = "vulnerable";
      } else {
        move_uploaded_file($file["tmp_name"], "uploads/" . $filename);
        $message = "File uploaded";
      }

    } else {

      move_uploaded_file($file["tmp_name"], "uploads/" . $filename);
      $message = "File uploaded";
    }

    if ($difficulty === "easy" && $ext === "php") {
      $flagReveal = $FLAG;
    }
  }
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>File Upload Lab</title>
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

select, input[type="file"] {
    width:100%;
    padding:12px;
    border-radius:10px;
    border:1px solid #334155;
    background:#0a0e27;
    color:#e5e7eb;
    margin-bottom:14px;
}

.execute-btn {
    padding:14px 22px;
    border-radius:10px;
    border:none;
    background:#2563eb;
    color:white;
    cursor:pointer;
    font-weight:600;
    width:100%;
}

.execute-btn:hover { background:#1d4ed8; }

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

.payload {
    background:#0a0e27;
    padding:12px;
    border-radius:10px;
    border:1px solid #334155;
    margin-top:10px;
    font-family:monospace;
    font-size:13px;
}

a { color:#38bdf8; text-decoration:none; }
</style>
</head>
<body>

<div class="container">

<div class="header">
<h1>📁 File Upload Lab</h1>
<p class="subtitle">Test file upload restrictions and bypass techniques.</p>
</div>

<div class="grid">

<div>

<div class="card">
<h2 class="section-title">Lab Configuration</h2>

<form method="POST" enctype="multipart/form-data">

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

<label>Select File</label>
<input type="file" name="file">

<button class="execute-btn">Upload</button>

</form>
</div>

<?php if ($message): ?>
<div class="card" style="margin-top:24px;">
<h2 class="section-title">Upload Result</h2>
<div class="output-box">
<?= htmlspecialchars($message) ?>
</div>

<?php if ($flagReveal): ?>
<div class="flag-box">
🚩 <?= htmlspecialchars($flagReveal) ?>
</div>
<?php endif; ?>

</div>
<?php endif; ?>

</div>

<div>

<div class="card">
<h2 class="section-title">Lab Info</h2>
<p><strong>Category:</strong> File Upload</p>
<p><strong>Risk:</strong> Remote Code Execution</p>
<p><strong>Upload Path:</strong> /uploads/</p>
</div>

<div class="card" style="margin-top:24px;">
<h2 class="section-title">Payload Guide</h2>

<div class="payload">
Basic Bypass:<br>
shell.php
</div>

<div class="payload">
Advanced:<br>
shell.php.jpg
</div>

</div>

<div class="card" style="margin-top:24px;">
<h2 class="section-title">Uploads Directory</h2>
<a href="/uploads/" target="_blank">Browse /uploads/</a>
</div>

</div>

</div>

</div>

</body>
</html>