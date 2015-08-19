module.exports = function(app) {
  var Person = app.models.Person;
  var Host = app.models.Host;
  var Personvshost = app.models.Personvshost;

  Person.listByHost = function(hostid, query, limit, skip, cb) {
    if(!query) query = '';
    if(!skip) skip=0;

    Host.findById(hostid, function(err,result) {
      Personvshost.find({
        where:{
          and: [ 
            {HostDestination:result.HostID},
            {EndDatetime:null}
          ]
        },
        order: 'CID',
      }, function(err, results) {
        var cid_key = [];
        var people = [];
        results.forEach(function(record) {
          if(cid_key.indexOf(record.CID) == -1) {
            cid_key.push(record.CID);
          }
        });
        Person.find({
          where: {
            and:[
              {CID : {inq : cid_key}},
              {
                or: [
                  {CID : {like: '%'+query+'%'}},
             //   {FirstName : {like: '%'+query+'%'}},
             //   {LastName : {like: '%'+query+'%'}}
                ]
              }
            ]
          },
          order: 'CID'}, function(err, result) {
          var end=result.length;
          if(!limit) limit=end;

          if(skip+limit<end) {
            end=skip+limit;
          }

          cb(null, result.slice(skip,end));
        });
      });
    });
  };
  
  Person.remoteMethod('listByHost', { 
    accepts: [
      {arg: 'hostid', type:'string'},
      {arg: 'query', type:'string'},
      {arg: 'limit', type:'number'},
      {arg: 'skip', type:'number'},
    ],
    returns:{root:true},
    http: {path:'/listByHost', verb:'get'}
  });
};
