const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'app.db');
const db = new sqlite3.Database(dbPath);

// initialize tables if not exists
const init = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      active INTEGER DEFAULT 0
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      date TEXT,
      creator_id INTEGER,
      FOREIGN KEY(creator_id) REFERENCES users(id)
    )`);
  });
};

module.exports = { db, init };
