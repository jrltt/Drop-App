var _ = require('underscore');
var User = Parse.Object.extend('User');

exports.index = function(req, res) {
  var query = new Parse.Query(User);
  query.find().then(function(results) {
    res.render('user/index', { users : results});
  },
  function() {
    res.send(500, 'Fail loading user index');
  });
};