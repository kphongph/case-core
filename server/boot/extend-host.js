module.exports = function(server) {
  var dataSource = server.dataSources.caseDs;
  var Province = server.models.Province;
  var Host = server.models.Host;

  Province.hasMany(Host, {foreignKey:'HostProvince','as':'hosts'});

};
