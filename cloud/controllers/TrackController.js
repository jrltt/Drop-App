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
	// var user = Parse.User.current();
	var Track = Parse.Object.extend('Track');
	var query = new Parse.Query(Track);
	query.get(req.params.id, {
		success: function(track) {
			var relation = track.relation('authorId');
			var relQuery = relation.query();
			relQuery.find({
				success: function(results) {
					res.json({
						'Track' : track,
						'authorId Relation' : results
					});
				},
				error: function(error) {
					alert('error'+error.message);
				}
			});
		},
		error: function(object, error) {
			alert('Error:' + error.message);
		}
	});

	// query.equalTo('authorId', user.id);
	/*query.find({
		success: function(result) {
			if (result) {
				res.json({'Founda:' : result});
			} else {
				res.send('No relation found');
			}
		},
		error: function(error) {
			res.send('Error: ' + error.message);
		}
	}); */
}

exports.index = function(req, res) {
	var Track = Parse.Object.extend('Track');
	var query = new Parse.Query(Track);
	// query.include('authorId');
	query.find({
		success: function(results) {
			res.json({'result' : results});
		},
		error: function(error) {
			alert('Error: ' + error.message);
		}
	});
};