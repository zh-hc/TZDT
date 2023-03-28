const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('xxqg_tiku.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the xxqg_tiku database.');
});

// 设置响应头部，允许跨域访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.get('/search', (req, res) => {
  const keyword = req.query.keyword;
  const sql = `SELECT * FROM TZDT WHERE question LIKE '%${keyword}%' OR answer LIKE '%${keyword}%' ORDER BY (CASE WHEN question LIKE '${keyword}%' THEN 1 ELSE 0 END) DESC, LENGTH(question) ASC, LENGTH(answer) ASC LIMIT 10`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});


app.listen(3001, () => {
  console.log('Server started on port 3001');
});
