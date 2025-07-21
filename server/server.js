const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const SECRET = process.env.JWT_SECRET || 'secret';
const DEMO = process.env.ENABLE_DEMO === '1';

const db = new sqlite3.Database('db.sqlite');

// create tables if not exist
const initDB = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      created_by INTEGER,
      FOREIGN KEY(created_by) REFERENCES users(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      description TEXT,
      taken_by INTEGER,
      FOREIGN KEY(event_id) REFERENCES events(id),
      FOREIGN KEY(taken_by) REFERENCES users(id)
    )`);
  });
};

const createDemoData = async () => {
  const hash = await bcrypt.hash('demo', 10);
  db.serialize(() => {
    db.run(`INSERT OR IGNORE INTO users(username, password, role) VALUES
      ('parent', ?, 'parent'),
      ('teacher', ?, 'teacher'),
      ('admin', ?, 'admin')`, [hash, hash, hash]);
    db.run(`INSERT OR IGNORE INTO events(title, created_by) VALUES ('Demo Event', 2)`);
  });
};

initDB();
if (DEMO) createDemoData();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("../public"));

// auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({error: 'missing'});
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({error: 'invalid'});
  }
}

app.post('/api/register', async (req, res) => {
  const {username, password, role = 'parent'} = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users(username, password, role) VALUES(?,?,?)', [username, hash, role], function(err) {
    if (err) return res.status(400).json({error: err.message});
    res.json({id: this.lastID});
  });
});

app.post('/api/login', (req, res) => {
  const {username, password} = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err || !row) return res.status(400).json({error: 'invalid'});
    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(400).json({error: 'invalid'});
    const token = jwt.sign({id: row.id, role: row.role}, SECRET);
    res.json({token});
  });
});

app.get('/api/events', auth, (req, res) => {
  db.all('SELECT * FROM events', (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/api/events', auth, (req, res) => {
  const {title} = req.body;
  db.run('INSERT INTO events(title, created_by) VALUES(?, ?)', [title, req.user.id], function(err) {
    if (err) return res.status(400).json({error: err.message});
    res.json({id: this.lastID});
  });
});

app.get('/api/events/:id/items', auth, (req, res) => {
  db.all('SELECT * FROM items WHERE event_id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/api/events/:id/items', auth, (req, res) => {
  const {description} = req.body;
  db.run('INSERT INTO items(event_id, description) VALUES(?, ?)', [req.params.id, description], function(err) {
    if (err) return res.status(400).json({error: err.message});
    res.json({id: this.lastID});
  });
});

app.post('/api/items/:id/take', auth, (req, res) => {
  db.run('UPDATE items SET taken_by = ? WHERE id = ?', [req.user.id, req.params.id], function(err) {
    if (err) return res.status(400).json({error: err.message});
    res.json({updated: this.changes});
  });
});

app.listen(PORT, () => console.log('Server running on', PORT));
