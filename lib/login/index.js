'use strict';

const Boom = require('boom');
const config = require('../config');
const redisClient = require('redis-connection')();
const JWT = require('jsonwebtoken');

exports.register = (server, options, next) => {

  server.route({
    method: ['GET', 'POST'],
    path: '/login',
    config: {
      auth: 'facebook',
      handler: (request, reply) => {


      if (!request.auth.isAuthenticated) {
        return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message));
      }

      const profile = request.auth.credentials.profile;

      var session = {
         valid: true, // this will be set to false when the person logs out
         id: profile.id,
         username: profile.displayName, 
         exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
       }
       // create the session in Redis
       redisClient.set(session.id, JSON.stringify(session));
       // sign the session as a JWT
       var jwt = JWT.sign(session, config.secret); // synchronous
       console.log(jwt);

      return reply.redirect('/private').state('token', jwt);
    }
  }
  });

  return next();
}

exports.register.attributes = {
  name: 'Login'
}
