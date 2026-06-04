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

    const { email, password } = req.body;

    if (!email || !password) {
      return sendJson(res, 400, { message: 'Email et mot de passe requis.' });
    }

    const user = await User.findOne({ email });

    if (!user || user.password !== hashPassword(password)) {
      return sendJson(res, 401, { message: 'Identifiants incorrects.' });
    }

    return sendJson(res, 200, {
      message: 'Connexion reussie.',
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return sendJson(res, 500, { message: 'Erreur interne du serveur' });
  }
});

module.exports = router;
