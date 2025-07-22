const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { db, init } = require('./db');

init();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

// basic health check
app.get('/', (req, res) => {
  res.json({ message: 'Mitplan API' });
});

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_REQUESTS) || 100
});
app.use(limiter);

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

// Simple mailer using environment variables
let transporter;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

// Registration endpoint
app.post('/api/auth/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
    db.run('INSERT INTO users(email,password,role) VALUES(?,?,?)', [email, hashed, 'parent'], function(err) {
      if (err) return res.status(400).json({ error: 'User exists' });
      const token = jwt.sign({ id: this.lastID }, JWT_SECRET, { expiresIn: '1d' });
      // send activation email if transporter configured
      if (transporter) {
        transporter.sendMail({ to: email, subject: 'Activate', text: `Activate with token: ${token}` });
      }
      res.json({ message: 'Registered', token });
    });
  });

// Login endpoint
app.post('/api/auth/login', body('email').isEmail(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email=?', [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Simple auth middleware
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.sendStatus(401);
  }
};

// Events
app.get('/api/events', authenticate, (req, res) => {
  db.all('SELECT * FROM events', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json(rows);
  });
});

app.post('/api/events', authenticate,
  body('title').isLength({ min: 3 }),
  body('date').isISO8601(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, description, date } = req.body;
    db.run('INSERT INTO events(title,description,date,creator_id) VALUES(?,?,?,?)',
      [title, description, date, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: 'db error' });
        res.json({ id: this.lastID });
      });
  });

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => console.log('Server running on port ' + port));
}
module.exports = app;
