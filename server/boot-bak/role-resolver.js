module.exports = function(app) {
  var Role = app.models.Role;
  var Employee = app.models.Employee;

  Role.registerResolver('staff', function(role, context, cb) {

    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }
    
    var userId = context.accessToken.userId;
    if(!userId) {
      return reject();
    }
    
    Employee.count({username:userId}, function(err, count) {
      if(err) {     
        console.log(err);
        return cb(null, false);
      }
      cb(null, count>0);
    });
    
  });
};
