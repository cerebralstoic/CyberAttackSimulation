CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT
);

INSERT INTO users VALUES
(1, 'admin', 'admin123'),
(2, 'user', 'password'),
(3, 'test', 'test123');
