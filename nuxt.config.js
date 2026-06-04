const registerRoute = require('./server/register');
const loginRoute = require('./server/login');
const usersRoute = require('./server/users');
const bodyParser = require('body-parser');
const messagesRoute = require('./server/messages');
const helloRoute = require('./server/api/yo');

module.exports = {
  serverMiddleware: [
    bodyParser.json(),
    { path: '/api/register', handler: registerRoute },
    { path: '/api/login', handler: loginRoute },
    { path: '/api/users', handler: usersRoute },
    { path: '/api/yo', handler: helloRoute },
    { path: '/api/messages', handler: messagesRoute },
  ],

  head: {
    title: 'cat-chat',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: [],
  plugins: [],
  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
  ],

  modules: [],

  axios: {
    baseURL: '/',
  },

  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  build: {},

  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
  },
};
