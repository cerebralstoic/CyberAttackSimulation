<?php
echo "<h3>Upload successful</h3>";
echo "<p>PHP code execution confirmed.</p>";

echo "<pre>";
echo "User: " . get_current_user() . "\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Working Directory: " . getcwd() . "\n";
echo "</pre>";
?>