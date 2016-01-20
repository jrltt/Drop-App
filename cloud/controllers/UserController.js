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

exports.signup = function(req, res) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var user = new Parse.User();
	user.set('username', username);
	user.set('email', email);
	user.set('password', password);

	user.signUp(null, {
		success: function(user) {
			var acl = new Parse.ACL(user);
			acl.setRoleReadAccess("User", true);
			acl.setRoleWriteAccess("User", true);
			acl.setPublicReadAccess(true);
			user.setACL(acl);
			console.log(JSON.stringify(user));
			res.redirect('post');
		},
		error: function(user, error) {
			res.send('Error code: '+ error.code + ' ** Error message:' + error.message);
		}
	});
};

exports.login = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	Parse.User.logIn(username, password, {
		success: function(user) {
			// res.send(Parse.User.current());
			res.redirect('post/create');
		},
		error: function(user, error) {
			res.send('Error: '+ error.code +' ' +error.message);
		}
	});
};