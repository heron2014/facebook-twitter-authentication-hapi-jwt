'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/private',
    config: {
    handler: (request, reply) => {

      const ctx = {
        name: request.auth.credentials.username
      }
  
      reply.view('private', {name: ctx.name});
    }
      }
  });

  return next();
}

exports.register.attributes = {
  name: 'Private'
}
