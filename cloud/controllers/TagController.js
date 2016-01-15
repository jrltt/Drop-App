var _ = require('underscore');

exports.getTags = function() {
	var Tag = Parse.Object.extend('Tag');
	var query = new Parse.Query(Tag);
	query.find({
		success: function(tags) {
			return tags;
		},
		error: function(error) {
			return 'error: ' + error.message;
		}
	});
}