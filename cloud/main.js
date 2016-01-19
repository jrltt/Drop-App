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