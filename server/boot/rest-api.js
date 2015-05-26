module.exports = function mountRestApi(server) {
  var restApiRoot = server.get('restApiRoot');
  console.log('mountRestApi');

  server.use(restApiRoot, server.loopback.rest());
};
