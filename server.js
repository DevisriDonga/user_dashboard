const express = require('express');
const app = express();
const port = 3001;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database(':memory:');

// Create table
db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      dob TEXT,
      contact TEXT,
      email TEXT,
      description TEXT
    )
  `);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.post('/users', (req, res) => {
    const { name, dob, contact, email, description } = req.body;
    db.run(
      `INSERT INTO users (name, dob, contact, email, description) VALUES (?, ?, ?, ?, ?)`,
      [name, dob, contact, email, description],
      function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
      }
    );
  });
  app.get('/users', (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
  
    db.all(`SELECT * FROM users LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json(rows);
    });
  });
  app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json(row);
    });
  });
  app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, dob, contact, email, description } = req.body;
  
    db.run(
      `UPDATE users SET name = ?, dob = ?, contact = ?, email = ?, description = ? WHERE id = ?`,
      [name, dob, contact, email, description, id],
      function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
      }
    );
  });
  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
  
    db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ deleted: this.changes });
    });
  });
      