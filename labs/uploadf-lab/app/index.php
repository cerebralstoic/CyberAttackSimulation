<?php
$mode = $_POST["mode"] ?? "vulnerable";
$difficulty = $_POST["difficulty"] ?? "easy";

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
.box {
  margin-top:14px;
  padding:10px;
  border-radius:8px;
  background:#020617;
  border:1px dashed #334155;
  color:#facc15;
  font-size:13px;
}
a { color:#38bdf8 }
</style>
</head>
<body>
<div class="container">
<h1>📁 File Upload Lab</h1>

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

<label>Choose File</label>
<input type="file" name="file">

<button>Upload</button>
</form>

<?php if ($message): ?>
<div class="box"><?= htmlspecialchars($message) ?></div>
<?php endif; ?>

<div class="box">
<strong>Uploads Directory:</strong><br>
<a href="/uploads/" target="_blank">/uploads/</a>
</div>

</div>
</body>
</html>
