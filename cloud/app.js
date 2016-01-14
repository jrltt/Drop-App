var express = require('express');
var moment = require('moment'); // npm para fechas
var _ = require('underscore'); // helper de javascript
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');


var userController = require('cloud/controllers/UserController.js');
var postController = require('cloud/controllers/PostController.js');

var requireUser = require('cloud/require-user'); // Middleware para usuarios

var app = express(); // init Express en Cloud code

// Configuración global
app.set('views', 'cloud/views');  // carpeta de templaste
app.set('view engine', 'ejs');    // engine para los templates
app.use(parseExpressHttpsRedirect());    // Automatically redirect non-secure urls to secure ones
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('SECRET_SIGNING_KEY'));
app.use(parseExpressCookieSession({
  fetchUser: true,
  key: 'user.sess',
  cookie: {
    maxAge: 3600000 * 24 * 30
  }
}));

app.locals._ = _; // en locals se guarda underscore
app.locals.formatTime = function(time) { // custom method para darle formato a las fechas
  return moment(time).format('MMMM Do YYYY, h:mm a');
};

// root de la app
app.get('/', function(req, res) {
  res.render('home', {title : "Home"});
});

// Users
app.get('/user', userController.index);

// Signup
app.get('/signup', function(req, res) {
	res.render('user/signup');
});

app.post('/signup', userController.signup);

// Log in
app.get('/login', function(req, res) {
	res.render('user/login');
});

app.post('/login', userController.login);

//Basic CRUD for post
app.get('/post', postController.index);
app.get('/post/create', requireUser, postController.create);
app.post('/post', postController.store);
app.get('/post/:id', postController.show);
app.get('/post/:id/edit', postController.edit);
app.put('/post/:id', postController.update);
// app.del('/post/:id', postController.delete);

//Dump data
app.get('/dump', function(req, res) {
  for (var i = 0; i < 10; i++) {
    var User = Parse.Object.extend('User');
    var user = new User();
    user.set('username', 'Dump'+i);
    user.set('password', 'test');
    user.set('email', 'email'+i+'@ptchwrks.com');
    user.set('surname', 'Sur'+i+'-name');
    user.save();
  };
  res.send('10 users create');
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
