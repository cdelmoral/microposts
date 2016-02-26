var Micropost = require('./micropost-model');

var MicropostsController = function() {};

MicropostsController.find = function(req, res, next, id) {
  Micropost.findByIdAsync(id).then(function(micropost) {
    req.micropost = micropost;
    next();
    return;
  }).catch(console.log.bind(console));
};

MicropostsController.create = function(req, res, next) {
  Micropost.createAsync({ user_id: req.user._id, content: req.body.content }).then(function(micropost) {
    req.user.microposts_count++;
    return req.user.save();
  }).then(function(user) {
    res.json(user.toObject());
  }).catch(console.log.bind(console));
};

MicropostsController.destroy = function(req, res, next) {
  req.micropost.remove().then(function(micropost) {
    req.user.microposts_count--;
    return req.user.save();
  }).then(function(user) {
    res.status(200).send('Micropost was deleted.');
  }).catch(console.log.bind(console));
};

MicropostsController.index = function(req, res, next) {
  var skip = (req.query.pageNumber - 1) * req.query.itemsPerPage;
  var sort = { created_at: -1 };
  var params = { limit: req.query.itemsPerPage, skip: skip, sort: sort };

  var micropostsPromise = Micropost.findAsync({ user_id: req.user._id }, null, params)
    .then(function(microposts) {
      var objects = [];
      for (var i = 0; i < microposts.length; i++) {
        objects.push(microposts[i].toObject());
      }
      return objects;
    });

  var countPromise = Micropost.countAsync({ user_id: req.user._id });

  Promise.all([micropostsPromise, countPromise]).then(function(results) {
    res.json({ count: results[1], microposts: results[0] });
  }).catch(console.log.bind(console));
};

MicropostsController.count = function(req, res, next) {
  Micropost.countAsync({ user_id: req.user._id }).then(function(count) {
    res.json({ count: count });
  }).catch(console.log.bind(console));
};

module.exports = MicropostsController;
