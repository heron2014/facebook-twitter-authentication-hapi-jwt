'use strict';

if (process.env.NODE_ENV === 'production') {
  //offer production stage env var
  module.exports = {
    host: process.env.host || '',
    dbURI: process.env.dbURI,
    secret: process.env.secret,
    fb: {
      clientID: process.env.fbClientID,
      clientSecret: process.env.fbClientSecret,
    }
  }
} else {
  //offer dev stage setting and data
  module.exports = require('./development.json')
}
