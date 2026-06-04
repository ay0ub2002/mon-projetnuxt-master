const express = require('express');
const router = express.Router();
const User = require('./userModel');
const connectDB = require('./db');

const sendJson = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

router.get('/', async (req, res, next) => {
  try {
    await connectDB();

    const users = await User.find({
      username: { $exists: true, $nin: ['', null] },
      email: { $exists: true, $nin: ['', null] },
    }, 'username email createdAt').sort({ username: 1 });

    return sendJson(res, 200, users.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    })));
  } catch (error) {
    console.error('Erreur GET /api/users :', error);
    return sendJson(res, 500, { message: 'Erreur interne du serveur' });
  }
});

module.exports = router;
