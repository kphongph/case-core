module.exports = function(Host) {

  Host.search = function(id, cb) {
    Host.findById(id, function(err, host) {
      console.log(host);
    });
    cb(null, []);
  }
  
  Host.remoteMethod('search', {
    accepts: [ 
      {arg: 'id', type:'string'}
    ],
    returns: { root:true},
    http: {path:'/search', verb:'get'}
  });
};
