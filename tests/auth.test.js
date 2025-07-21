const request = require('supertest');
const fs = require('fs');
const path = require('path');
process.env.DATABASE_PATH = path.join(__dirname, '../data/test.db');
const app = require('../server');
const { db } = require('../db');

afterAll(() => {
  db.close();
  fs.unlinkSync(process.env.DATABASE_PATH);
});

describe('auth flow', () => {
  it('registers and logs in', async () => {
    const email = 'user@test.com';
    const password = 'password';
    let res = await request(app).post('/api/auth/register').send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
