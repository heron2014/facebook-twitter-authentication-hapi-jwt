'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: {
        mode: 'optional'
      },
      handler: (request, reply) => {

      if (request.auth.isAuthenticated) {
        console.log('here');
        const name = request.auth.credentials.displayName;
        console.log(name);
        return reply.view('home', {name: name});
      }

      return reply.view('home', {name: 'stranger'});
    }
  }
  });

  return next();
}

exports.register.attributes = {
  name: 'Home'
}
