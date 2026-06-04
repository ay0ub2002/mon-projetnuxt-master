const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const User = require('./userModel');
const connectDB = require('./db');

const hashPassword = (password) =>
  crypto.createHash('sha256').update(password).digest('hex');

const sendJson = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

router.post('/', async (req, res, next) => {
  try {
    await connectDB();

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return sendJson(res, 400, { message: 'Pseudo, email et mot de passe requis.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return sendJson(res, 400, { message: 'Ce pseudo ou cet email est deja utilise.' });
    }

    const newUser = new User({
      username,
      email,
      password: hashPassword(password),
    });

    await newUser.save();

    return sendJson(res, 201, { message: 'Inscription reussie.' });
  } catch (error) {
    console.error('Erreur lors de l inscription :', error);
    return sendJson(res, 500, { message: 'Erreur interne du serveur' });
  }
});

module.exports = router;
