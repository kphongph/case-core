module.exports = function(app) {
  var Personvshost = app.models.Personvshost;
  var Host = app.models.Host;

  Host.activePerson = function(id,cb) {
    Personvshost.find({
      fields:{CID:true},
      where:{
        hostdestination:id,
        enddatetime:null
      }
    },function(err,results) {
      var cid_list = [];
      var cid_key = [];
      results.forEach(function(cid) {
        if(cid_key.indexOf(cid.CID)==-1) {
          cid_key.push(cid.CID);
          cid_list.push(cid);
        }
      });
      cb(null,cid_list);
    });
  };

  Host.remoteMethod('activePerson', {
    accepts:[{arg:'id', type:'string', required:true}],
    returns:[{type:'array',root:true}],
    http:{
      path:'/:id/people',verb:'get'
    }
  });
};
