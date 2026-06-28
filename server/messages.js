const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Message = require('./messageModel');
const User = require('./userModel');
const connectDB = require('./db');
const bodyParser = require('body-parser');
const { URL } = require('url');

router.use(bodyParser.json());

const sendJson = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

const serializeMessage = (message) => ({
  _id: message._id.toString(),
  sender: message.sender ? message.sender.toString() : '',
  receiver: message.receiver ? message.receiver.toString() : '',
  username: message.username,
  content: message.content,
  createdAt: message.createdAt,
});

const getQuery = (req) => {
  const requestUrl = new URL(req.url, 'http://localhost');

  return {
    userId: requestUrl.searchParams.get('userId'),
    contactId: requestUrl.searchParams.get('contactId'),
  };
};

router.get('/', async (req, res) => {
  try {
    await connectDB();

    const { userId, contactId } = getQuery(req);

    if (!userId || !contactId) {
      return sendJson(res, 400, { message: 'userId et contactId requis' });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(100);

    return sendJson(res, 200, messages.map(serializeMessage));
  } catch (error) {
    console.error('Erreur GET /api/messages:', error);
    return sendJson(res, 500, { message: 'Erreur interne du serveur' });
  }
});

router.post('/', async (req, res) => {
  try {
    await connectDB();

    const { senderId, receiverId, content } = req.body || {};

    if (!senderId || !receiverId || !content) {
      return sendJson(res, 400, { message: 'senderId, receiverId et content requis' });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return sendJson(res, 404, { message: 'Utilisateur introuvable' });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      username: sender.username,
      content,
    });

    await newMessage.save();

    return sendJson(res, 201, { message: 'Message enregistre', data: serializeMessage(newMessage) });
  } catch (error) {
    console.error('Erreur POST /api/messages:', error);
    return sendJson(res, 500, { message: 'Erreur interne du serveur' });
  }
});

router.delete('/:messageId', async (req, res) => {
  try {
    await connectDB();

    const { messageId } = req.params;
    const { senderId } = req.body || {};

    if (!messageId || !senderId) {
      return sendJson(res, 400, { message: 'messageId et senderId requis' });
    }

    if (!mongoose.isValidObjectId(messageId) || !mongoose.isValidObjectId(senderId)) {
      return sendJson(res, 400, { message: 'Identifiant invalide' });
    }

    const deletedMessage = await Message.findOneAndDelete({
      _id: messageId,
      sender: senderId,
    });

    if (!deletedMessage) {
      return sendJson(res, 404, { message: 'Message introuvable ou suppression interdite' });
    }

    return sendJson(res, 200, { message: 'Message supprime' });
  } catch (error) {
    console.error('Erreur DELETE /api/messages:', error);
    return sendJson(res, 500, { message: 'Erreur interne du serveur' });
  }
});

module.exports = router;
