var express = require('express');
var moment = require('moment'); // npm para fechas
var _ = require('underscore'); // helper de javascript
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');

var userController = require('cloud/controllers/UserController.js');
var postController = require('cloud/controllers/PostController.js');
var trackController = require('cloud/controllers/TrackController.js');

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

app.get('/logout', function(req, res) {
	Parse.User.logOut();
	res.redirect('/');
})
//Basic CRUD for post
app.get('/post', postController.index);
app.get('/post/create', requireUser, postController.create);
app.post('/post', requireUser, postController.store);
app.get('/post/:id', postController.show);
app.get('/post/:id/edit', requireUser, postController.edit);
app.put('/post/:id', requireUser, postController.update);
// app.del('/post/:id', postController.delete);

app.get('/track', trackController.setRelation);
app.get('/track/:id', trackController.getRelation);
app.get('/tracks', trackController.index);

//Dump data
/*app.get('/dump', function(req, res) {
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
*/

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

app.get('/createAdmin', function(req, res) {
	var user = new Parse.User();
	user.set('username', 'jrltt');
	user.set('password', 'test');
	user.set('email', 'joaquin@ptchwrks.com');
	user.set('surname', 'Joaquin');
	user.set('genre', 'male');
	user.save(null, {
		success: function(user) {
			res.send('User created: '+ user);
		},
		error: function(user,error) {
			res.send('Error: '+ error.message);
		}
	});
});

// app.get('/setRole', function(req, res) {
//   var user = Parse.User.current();
//   var acl = new Parse.ACL();
//   var currentId = user.id;
//     acl.setRoleReadAccess("Admin",true);
//     acl.setRoleWriteAccess("Admin",true);
//     acl.setReadAccess(currentId,true);
//     acl.setWriteAccess(currentId,true);
//     // user.setACL(acl);
//     // user.save();
//     var role = new Parse.Role();
//     var query = new Parse.Query(role);
//     query.equalTo("objectId", "ixNRu60hIu");
//     query.find({
//       success: function(result) {
//         var r = new Parse.Role('Admin', acl);
//         r.getUsers().add(user);
//         r.save();

//         res.json({
//           'res' : r,
//         });
//       },
//       error: function(error) {
//         alert('erro' + error.message);
//       }
//     });
  

//   // role.getUsers().add(Parse.User.current());
//   // role.save();
//   // if ( role ) {
//   //   alert('role set');  
//   // }
  
// 	// var User = Parse.Object.extend('User');
// 	// var query = new Parse.Query(User);
// 	// var user = new User();
// 	// user.id = 'btOGW8WJBv';
// 	// query.get(Parse.User.current()).then(function(user) {
// 	// 	var roleACL = new Parse.ACL();
// 	// 	roleACL.setPublicReadAccess(true);
// 	// 	// roleACL.setWriteAccess(user.id, true);
// 	// 	var role = new Parse.Role("adminTest", roleACL);
// 	// 	var relation = role.relation('users');
// 	// 	relation.add(user.id);
// 	// 	role.save();
// 	// 	alert('role save');
// 	// }, function() {
// 	// 	console.log('nope');
// 	// }); // works
// 	// query.equalTo("username", "jrltt");
// 	// query.find({
// 	// 	success: function(result) {
// 	// 		console.log('Result' + result);
// 	// 	},
// 	// 	error: function(error) {
// 	// 		console.log('Error' + error);
// 	// 	}
// 	// });
// });
app.get('/newAdmin', function(req, res) {
  var user = Parse.User.current();
  var acl = new Parse.ACL();
  var currentId = user.id;
  acl.setRoleReadAccess("Admin",true);
  acl.setRoleWriteAccess("Admin",true);
  acl.setReadAccess(currentId,true);
  acl.setWriteAccess(currentId,true);
  user.setACL(acl);
  user.save();

  var role = new Parse.Role();
  var query = new Parse.Query(role);
  query.equalTo("objectId", "ixNRu60hIu");
  query.first({
    success: function(result) {
      Parse.Cloud.useMasterKey(); // Master key
      // var role = result;
      // var adminRelation = new Parse.Relation(result, 'users');
      // adminRelation.add(user);
      // role.save();
      var admin = result;
      admin.getUsers().add(user);
      admin.save();
      res.json({
        'rol' : role,
        'user' : user,
      });
    },
    error: function(error) {
      alert('erro' + error.message);
    }
  });
});

app.get('/newset', function(req, res) {
  Parse.Cloud.useMasterKey();
  var roleACL = new Parse.ACL();
  roleACL.setPublicReadAccess(false);
  var role = new Parse.Role("Administrator", roleACL);
  role.getUsers().add(Parse.User.current());
  role.save();
  res.json({'role' : role});
});

app.get('/secret', function(req, res) {
  res.json({'text' : 'super secret'});
});

app.get('/check', function(req, res) {
  var authorized = false;
  console.log('Before test: Auth = ' + authorized);

  var queryRole = new Parse.Query(Parse.Role);
  queryRole.equalTo('name', 'Admin');
  queryRole.first({
      success: function(result) { // Role Object

         console.log("Okay, that's a start... in success 1 with results: " + result);

          var role = result;
          var adminRelation = new Parse.Relation(role, 'users');
          var queryAdmins = adminRelation.query();
          if ( !Parse.User.current() ) return;
          console.log('current ID: ' + Parse.User.current().id);
          queryAdmins.equalTo('objectId', Parse.User.current().id);
          queryAdmins.first({
              success: function(result) {    // User Object
                // console.log('result queryAdmin: ' + result);
                  var user = result;
                  if ( user.length === 0 ) {
                    res.json({'console' : 'Shiet, user not Admin'});
                  } else {
                    authorized = true;
                    console.log('Auth = ' + authorized);
                    res.json({'result inside queryAdmin ' : result});
                  }
              },
              error: function(error) {
                res.json({'error' : error.message});
              }
          });
      },
      error: function(error) {
          console.log("Bruh, can't find the Admin role " + error.message);
      }
  }).then(function() {
      console.log('After test: Auth = ' + authorized);
  });
});
app.listen();
