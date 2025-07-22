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
  it('serves the frontend application', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});

describe('api health endpoint', () => {
  it('returns welcome message', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Mitplan API');
  });
});
