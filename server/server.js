const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');

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
      role TEXT,
      active INTEGER DEFAULT 0,
      activation_token TEXT
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
    db.run(`INSERT OR IGNORE INTO users(username, password, role, active) VALUES
      ('parent', ?, 'parent', 1),
      ('teacher', ?, 'teacher', 1),
      ('admin', ?, 'admin', 1)`, [hash, hash, hash]);
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
  const token = crypto.randomBytes(16).toString('hex');
  db.run('INSERT INTO users(username, password, role, activation_token) VALUES(?,?,?,?)', [username, hash, role, token], function(err) {
    if (err) return res.status(400).json({error: err.message});
    res.json({id: this.lastID, activationToken: token});
  });
});

app.post('/api/activate', (req, res) => {
  const {token} = req.body;
  db.run('UPDATE users SET active = 1, activation_token = NULL WHERE activation_token = ?', [token], function(err) {
    if (err) return res.status(400).json({error: err.message});
    if (this.changes === 0) return res.status(400).json({error: 'invalid'});
    res.json({activated: true});
  });
});

app.post('/api/login', (req, res) => {
  const {username, password} = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err || !row) return res.status(400).json({error: 'invalid'});
    if (!row.active) return res.status(403).json({error: 'inactive'});
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
  if (!['teacher', 'admin'].includes(req.user.role)) {
    return res.status(403).json({error: 'forbidden'});
  }
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

app.get('/api/my-items', auth, (req, res) => {
  const sql = `SELECT items.id, items.description, events.title AS event_title
               FROM items JOIN events ON items.event_id = events.id
               WHERE taken_by = ?`;
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.get('/api/me', auth, (req, res) => {
  db.get('SELECT id, username, role FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(row);
  });
});

app.put('/api/me', auth, async (req, res) => {
  const {password} = req.body;
  if (!password) return res.status(400).json({error: 'missing'});
  const hash = await bcrypt.hash(password, 10);
  db.run('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.id], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({updated: this.changes});
  });
});

app.listen(PORT, () => console.log('Server running on', PORT));
