module.exports = function(FormTemplate) {
  FormTemplate.observe('before save', function(ctx, next) {
    if(ctx.instance) {
      if(!ctx.instance.createdDate) {
        ctx.instance.createdDate = new Date();
      }
      ctx.instance.updatedDate = new Date();
    } else {
      if(!ctx.data.createdDate) {
        ctx.data.createdDate = new Date();
      }
      ctx.data.updatedDate = new Date();
    }
    next();
  });

};
