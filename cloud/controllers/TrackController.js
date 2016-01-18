var _ = require('underscore');

exports.setRelation = function(req, res) {
	var User = Parse.Object.extend('User');
	var user6 = new User();
	user6.id = '2X1dREpgvR';
	var user2 = new User();
	user2.id = 'CRyEqR92dN';

	var Track = Parse.Object.extend('Track');
	var track = new Track();
	track.set('name', 'Algo salvaje');
	track.set('description', 'Lorem the ipsum');
	var relation = track.relation('authorId');
	relation.add(user6);
	relation.add(user2);
	track.save();
	alert('this is the track: ' + track);
	// userQuery.get('CRyEqR92dN').then()
};

exports.getRelation = function(req, res) {
	var user = Parse.User.current();
	var query = new Parse.Query('Track');
	query.equalTo('authorId', user);
	query.find({
		success: function(result) {
			if (result) {
				res.send('Founda: ' + result);
			} else {
				res.send('No relation found');
			}
		},
		error: function(error) {
			res.send('Error: ' + error.message);
		}
	})
}