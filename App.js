const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());

// Fungsi untuk generate token (bisa di-unit test)
const generateToken = (username) => {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
};

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'user' && password === 'password') {
    const token = generateToken(username);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware untuk autentikasi JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};

// Protected route
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = { app, generateToken, authenticateJWT, SECRET_KEY };
