const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI
  || 'mongodb+srv://ayouplock:gloupoi2001@cluster0.vjamf.mongodb.net/messagerie?retryWrites=true&w=majority&appName=Cluster0';

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(mongoUri)
    .then(() => {
      console.log('Connexion MongoDB reussie');
      return mongoose.connection;
    })
    .catch((err) => {
      connectionPromise = null;
      console.error('Erreur de connexion MongoDB', err.message);
      throw err;
    });

  return connectionPromise;
};

module.exports = connectDB;
