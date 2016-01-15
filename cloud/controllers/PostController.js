var _ = require('underscore');
var tagController = require('cloud/controllers/TagController.js');

var Post = Parse.Object.extend('Post');

exports.index = function(req, res) {
	var query = new Parse.Query(Post);
	query.descending('createdAt');
	query.include('createdBy');
	query.find().then(function(results) {
		res.render('../views/post/index', { posts : results});
	},
	function() {
		res.send(500, 'Fail find posts.');
	});
};

exports.create = function(req, res) {
	var Tag = Parse.Object.extend('Tag');
	var query = new Parse.Query(Tag);
	query.find({
		success: function(tags) {
			res.render('../views/post/create', {
				tags : tags,
			});
		},
		error: function(error) {
			res.send('error: ' + error.message);
		}
	});

};

exports.store = function(req, res) {
	var post = new Post();
	var title = req.body.title;
	var content = req.body.content;
	var tags = req.body.tag;
	var currentUser = Parse.User.current();

	post.set('title', title);
	post.set('content', content);
	post.set('tag', tags);
	// Set up ACL & Relation (pointer)
	var acl = new Parse.ACL();
	acl.setPublicReadAccess(true); // lectura publica
	if ( currentUser ) { 
		// Set (pointer) para asignar el usuario que ha creado el post
		post.set('createdBy', currentUser);
		acl.setWriteAccess(currentUser, true); // escritura solo este usuario
	}
	post.setACL(acl);

	post.save().then(function() {
		res.redirect('/post');
	},
	function(error) {
		res.json({code: error.code, message: error.message});
	});
};

exports.edit = function(req, res) {
	var query = new Parse.Query(Post);
	query.get(req.params.id).then(function(post) {
		if (post) { // si existe el post
			res.render('../views/post/edit', { post : post});
		} else {
			res.send('Not found, search again.');
		}
	},
	function() {
		res.send(500, 'Failed finding post.');
	});
};

exports.update = function(req, res) {
	var post = new Post();
	post.id = req.params.id;
	post.save(_.pick(req.body, 'title', 'content')).then(function() {
		res.redirect('/post/'+ post.id);
	},
	function() {
		res.send(500, 'Failed saving post');
	});
};

exports.show = function(req, res) {
	var Post = Parse.Object.extend('Post');
	var query = new Parse.Query(Post);
	var tmpPost = new Post();
	tmpPost.id = req.params.id;
	query.include('createdBy');
	query.get(tmpPost.id, {
		success: function(post) {
			// var title = post.get('title');
			// alert('Found:' + post.get('title'));
			res.render('../views/post/show', { 
				post : post
			});
		},
		error: function(object, error) {
			res.send(error.message);
		}
	});
	// var queryTmp = new Parse.Query(Post);
	// queryTmp.include("user");
	// queryTmp.equalTo("c", Parse.Object.createWithoutData("_User", createdBy);
	// queryTmp.find({
	// 	success: function(list) {
	// 		console.log(list);
	// },
	// 	error: function(object, error) {
	// 		console.error(error);
	// 		// The object was not retrieved successfully.
	// 		// error is a Parse.Error with an error code and description.
	// }
	// });
	// var postQuery = new Parse.Query(Post);

	/*postQuery.get(req.params.id).then(function(post) {
		// if (post) {
		// 	var query = new Parse.Query(Parse.User);
		// 	query.equalTo("objectId", post.get('createdBy').id);
		// 	query.find({
		// 	  success: function(results) {
		// 	  	console.log(results);
		// 	  	var username = 'test';
		// 	    res.render('../views/post/show', {post : post, user : username});
		// 	  },
		// 	  error: function(error) {
		// 	   res.render('../views/post/show', {post : post});
		// 	  }
		// 	});
		// 	// res.render('../views/post/show', {post : post, user : createdBy});
		// } else {
		// 	res.send('Not found');
		// }
	},
	function() {
		res.send(500, 'Fail.');
	})*/
};