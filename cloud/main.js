require('cloud/app.js');

Parse.Cloud.afterSave("signUp", function(request) {
   var adminRoleACL = new Parse.ACL();
    adminRoleACL.setPublicReadAccess(false);
    adminRoleACL.setPublicWriteAccess(false);
    var adminRole = new Parse.Role("administrator", adminRoleACL);
    adminRole.getUsers().add(Parse.User.current());
    adminRole.save();
    alert('well done!' + adminRole);

  /*  
  query = new Parse.Query("Post");
  query.get(request.object.get("post").id, {
    success: function(post) {
      post.increment("comments");
      post.save();
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });*/
});

Parse.Cloud.afterSave(Parse.User, function(request) {
  console.log('Request afterSave :' + request.user);
  Parse.Cloud.useMasterKey();
  var query = new Parse.Query(Parse.Role);
  query.equalTo('name', 'User');
  query.first({
    success: function(result) {
      var userRole = result;
      userRole.relation('users').add(request.user);
      userRole.save();
      alert('add User to role User');
    },
    error: function(error) {
      alert('Error: ' + error.message);
    }
  });
});