
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();
var _ = require('underscore');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());
app.use(express.methodOverride());

app.locals._ = _;

var userController = require('cloud/controllers/UserController.js');

app.get('/user', userController.index);

app.get('/dump', function(req, res) {
  for (var i = 0; i < 10; i++) {
    var user = Parse.Object.extend('User');
    user.set('username', 'Dump'+i);
    user.set('password', 'test');
    user.set('email', 'email'+i+'@ptchwrks.com');
    user.set('surname', 'Sur'+i+'-name');
    user.save();
  };
  res.send('10 users create');
});
// Renders the root of the app
app.get('/', function(req, res) {
  res.send('home');
});

app.get('/tes', function(req, res) {
  res.render('home');
});

// Accepts an email address to be saved from the landing page
app.post('/send_email', function(req, res) {
  var Email = Parse.Object.extend('Email');
  var email = new Email({ email: req.body.email });
  email.save().then(function() {
    res.render('home', { message: "Congrats, we'll contact you when we release!" });
  }, function() {
    res.send('Oops, something went wrong!');
  });
});

app.get('/create', function(req, res) {
	var Track = Parse.Object.extend("Track");
	var track = new Track();
	track.set("name", "Let me hear you scream");
	track.set("description", "The black album from Lorem ipsum.");
	track.save(null, {
		success: function(track) {
			res.send('New object created with objectID: '+ track.id);
		},
		error: function(track) {
			res.send('Failes to create new object, error code: '+ track.error);
		}
	})
});

app.get('/show/:id', function(req, res) {
	var Track = Parse.Object.extend("Track");
	var trackQuery = new Parse.Query(Track);

	trackQuery.get(req.params.id).then(function(track) {
		res.send(track);
	},
	function() {
		res.send(500, 'Fail');
	});

});

app.listen();
