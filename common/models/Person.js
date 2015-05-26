module.exports = function(Person) {
  
  Person.observe('before save', function(ctx, next) {
    if(ctx.instance) {
      ctx.instance.DateTimeUpdate = new Date();
    } else {
      ctx.data.DateTimeUpdate = new Date();
    }
    next();
  });
};
