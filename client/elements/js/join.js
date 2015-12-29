
var baseUrl = '/api/';
var limitRecord = 10;

function js_joinExample(ref, arrayModel, callback){
  var _limit = {'limit':limitRecord};
  for(var i = 0; i < arrayModel.length; i++){
    var modelname = arrayModel[i].modelName;
    var query = arrayModel[i].query;
    var url = baseUrl + modelname + '?where' 
    + JSON.stringify(query) + '&filter=' + JSON.stringify(_limit);
    httpGetAsync(ref, url, callback);
  }
}