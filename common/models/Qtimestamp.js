module.exports = function(Qtimestamp) {
  Qtimestamp.observe('before save', function(ctx, next) {
    
    var getToday = function() {
      var tmp = new Date();
      return new Date(tmp.getFullYear(),tmp.getMonth(),tmp.getDate());
    }
    
    if(ctx.instance) {
      if(!ctx.instance.RecordDate) {
          var c_date = 
          ctx.instance.RecordDate = getToday();
      } 
    } else {
      if(!ctx.data.RecordDate) {
          ctx.data.RecordDate = getToday();
      }
    }
    next();
  });
};