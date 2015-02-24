module.exports = function(Person) {
  Person.observe('before save', function(ctx, next) {
    console.log('before save');
    if(ctx.instance) {
      ctx.instance.DateTimeUpdate = new Date();
    } else {
      ctx.data.DateTimeUpdate = new Date();
    }
    next();
  });
};
