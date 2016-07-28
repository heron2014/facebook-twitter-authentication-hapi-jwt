'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Home = require('./lib/home');
const Handlebars = require('handlebars');

const Login = require('./lib/login');
const Private = require('./lib/private');

const HapiAuthJWT = require('hapi-auth-jwt2');
const Bell = require('bell');

const Auth = [Bell, HapiAuthJWT];
const Plugins = [Inert, Vision, Login, Home, Private];
const config = require('./lib/config');
const validate = require('./lib/validate');
const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 3000
});

server.register(Auth, error => {
  if (error) {
    throw error;
  }

    //Setup the session strategy
  server.auth.strategy('jwt', 'jwt', {
    key: config.secret,
    validateFunc: validate,
    verifyOptions: { ignoreExpiration: true }
  });

  //Setup the social Twitter login strategy
  server.auth.strategy('facebook', 'bell', {
    provider: 'facebook',
    password: config.secret, //Use something more secure in production
    clientId: config.fb.clientId,
    clientSecret: config.fb.clientSecret,
    isSecure: false, //Should be set to true (which is the default) in production
    scope: ['public_profile', 'user_about_me', 'email']
  });

  server.auth.default('jwt');

});

server.register(Plugins, (err) => {

  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layout',
  });

  server.start((err) => {
      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri);
  });


})

module.exports = server;
