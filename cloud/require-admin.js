// Use this middleware to require that a user is logged in
module.exports = function(req, res, next) {
  if (Parse.User.current()) {
    var user = Parse.User.current();
    var role = new Parse.Query(Parse.Role);
    role.equalTo('name', 'Admin');
    role.first({
      success: function(result) {
        var adminRole = result;
        var relation = new Parse.Relation(adminRole, 'users');
        var checkAdmin = relation.query();
        checkAdmin.equalTo('objectId', user.id);
        checkAdmin.first().then(function(result) {
          console.log('type : '+ typeof result);
          if ( result === undefined ) return res.json('You need to be a ADMIN. keep walking');
          console.log('admin: ' + JSON.stringify(result));
          next();
        }, function(error){
          console.log('error ' + error.message);
        });
      },
      error: function(error) {
        res.json('You need to be THE ADMIN. Keep walking');
      }
    });

  } else {
    res.send("You need to be auth to see this page. ADMIN");
  }
}
