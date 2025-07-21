const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'secret';
const db = new sqlite3.Database('data.db');

// init tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS events(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    date TEXT,
    owner INTEGER,
    FOREIGN KEY(owner) REFERENCES users(id)
  )`);
});

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).end();
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).end();
  }
}

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users(email, password) VALUES(?, ?)', [email, hash], function(err) {
    if (err) return res.status(400).json({error: 'User exists'});
    res.json({id: this.lastID});
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (!row) return res.status(400).json({error: 'Invalid'});
    if (!bcrypt.compareSync(password, row.password)) return res.status(400).json({error: 'Invalid'});
    const token = jwt.sign({id: row.id, email: row.email}, SECRET);
    res.json({token});
  });
});

app.get('/events', authenticate, (req, res) => {
  db.all('SELECT * FROM events', [], (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/events', authenticate, (req, res) => {
  const { title, description, date } = req.body;
  db.run('INSERT INTO events(title, description, date, owner) VALUES(?,?,?,?)',
    [title, description, date, req.user.id], function(err){
      if (err) return res.status(400).json({error: 'failed'});
      res.json({id: this.lastID});
    });
});

app.get('/events/:id', authenticate, (req, res) => {
  db.get('SELECT * FROM events WHERE id=?', [req.params.id], (err, row)=>{
    if (!row) return res.status(404).end();
    res.json(row);
  });
});

const port = process.env.PORT || 3001;
const server = app.listen(port, () => console.log('server started'));
module.exports = server;
