const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'shriyash27@',
  database: 'contact_book'
});

// Get contacts with optional favorite or search query
app.get('/contacts', (req, res) => {
  const { favorite, search } = req.query;
  let sql = 'SELECT * FROM contacts WHERE 1';
  let params = [];

  if (favorite === 'true') {
    sql += ' AND is_favorite = true';
  }

  if (search) {
    sql += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Toggle favorite
app.put('/contacts/:id/favorite', (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE contacts SET is_favorite = NOT is_favorite WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Favorite toggled' });
  });
});

app.listen(8080, () => console.log('Server running on port 8080'));
