<?php
$db = new SQLite3("users.db");

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    // 🚨 INTENTIONALLY VULNERABLE QUERY
    $query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
    $result = $db->query($query);

    if ($result && $result->fetchArray()) {
        $message = "✅ Login successful!";
    } else {
        $message = "❌ Invalid credentials";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
  <title>SQL Injection Lab</title>
</head>
<body>
  <h2>SQLi Login</h2>
  <form method="POST">
    <input name="username" placeholder="Username" />
    <input name="password" placeholder="Password" />
    <button>Login</button>
  </form>
  <p><?= htmlspecialchars($message) ?></p>
</body>
</html>
