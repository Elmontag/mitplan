const request = require('supertest');
const fs = require('fs');
let server;

beforeAll(() => {
  if (fs.existsSync('data.db')) fs.unlinkSync('data.db');
  server = require('../index');
});

afterAll(done => {
  server.close(done);
});

test('register and login', async () => {
  const email='test@example.com';
  const password='secret';
  await request(server).post('/register').send({email,password}).expect(200);
  const res = await request(server).post('/login').send({email,password}).expect(200);
  expect(res.body.token).toBeTruthy();
});

test('add and list events', async () => {
  const email='event@example.com';
  const password='pass';
  await request(server).post('/register').send({email,password});
  const login = await request(server).post('/login').send({email,password});
  const token = login.body.token;
  await request(server).post('/events').set('Authorization',`Bearer ${token}`)
    .send({title:'test',description:'d',date:'2025-01-01'}).expect(200);
  const list = await request(server).get('/events').set('Authorization',`Bearer ${token}`).expect(200);
  expect(list.body.length).toBeGreaterThan(0);
});
