var User = require('../users/user-model');
var SessionsHelper = require('./sessions-helper');
var Logger = require('../logger/logger');

var login = require('./sessions-helper').login;
var logout = require('./sessions-helper').logout;

var SessionsController = function(){};

SessionsController.find = function(req, res, next) {
  User.findByIdAsync(req.session.user_id).then(function(user) {
    if (user) {
      login(req, user);
    }

    next();
    return null;
  }).catch(Logger.logError);
};

/** Authenticates a user. */
SessionsController.create = function(req, res, next) {
  User.findOneAsync({ email: req.body.email.toLowerCase() }).then(function(user) {
    req.user = user;
    return user && user.authenticated(req.body.password, 'password');
  }).then(function(valid) {
    if (valid && req.user.activated) {
      login(req, req.user);
      res.json(req.user.toObject());
    } else if (valid) {
      res.status(401).send('User not yet activated');
    } else {
      res.status(401).send('Invalid credentials');
    }
  }).catch(Logger.logError);
};

/** Gets if the user is currently logged in. */
SessionsController.authenticated = function(req, res, next) {
  User.findByIdAsync(req.session.user_id).then(function(user) {
    if (user) {
      res.send(user.toObject());
    } else {
      res.send({ authenticated: false });
    }
  }).catch(Logger.logError);
};

/** Delete the current session for the currently logged in user. */
SessionsController.destroy = function(req, res, next) {
  SessionsHelper.logout(req).then(function() {
    res.status(200).send();
  }).catch(function(message) {
    res.status(500).send();
  });
};

module.exports = SessionsController;
