var _ = require('underscore');
var Post = Parse.Object.extend('Post');

exports.index = function(req, res) {
	var query = new Parse.Query(Post);
	query.find().then(function(results) {
		res.render('../views/post/index', { posts : results});
	},
	function() {
		res.send(500, 'Fail find posts.');
	});
};

exports.create = function(req, res) {
	res.render('../views/post/create');
}

exports.store = function(req, res) {
	var post = new Post();
	post.save(_.pick(req.body, 'title', 'content')).then(function() {
		res.redirect('/post');
	},
	function() {
		res.send(500, 'Failed saving post.');
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
	var postQuery = new Parse.Query(Post);
	postQuery.get(req.params.id).then(function(post) {
		if (post) {
			res.render('../views/post/show', {post : post});
		} else {
			res.send('Not found');
		}
	},
	function() {
		res.send(500, 'Fail.');
	})
};