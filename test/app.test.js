const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, generateToken, SECRET_KEY } = require('../app');

describe('Unit Testing: JWT Auth System', () => {
  // Unit test untuk fungsi generateToken
  it('✅ generateToken harus menghasilkan JWT yang valid', () => {
    const username = 'user';
    const token = generateToken(username);
    const decoded = jwt.verify(token, SECRET_KEY);
    expect(decoded.username).toBe(username);
  });
});

describe('Integration Testing: /login dan /protected', () => {
  let token;

  it('✅ /login: harus mengembalikan token untuk kredensial valid', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'password' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('❌ /login: harus gagal untuk kredensial tidak valid', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'user', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('✅ /protected: harus berhasil diakses dengan token yang valid', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'This is a protected route');
    expect(res.body).toHaveProperty('user');
  });

  it('❌ /protected: harus gagal diakses tanpa token', async () => {
    const res = await request(app)
      .get('/protected');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });

  it('❌ /protected: harus gagal diakses dengan token yang salah', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error', 'Forbidden');
  });
});
