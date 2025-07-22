const request = require('supertest');
const path = require('path');
const fs = require('fs');
process.env.DATABASE_PATH = ':memory:';
const app = require('../server');
const { db } = require('../db');

afterAll(() => {
  db.close();
});

describe('root endpoint', () => {
  it('returns welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Mitplan API');
  });
});
