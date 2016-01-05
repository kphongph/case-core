
var baseUrl = '/api/';
var limitRecord = 10;
var _limit = {'limit':limitRecord};

function js_joinExample(ref, arrayModel, callback){
  if(arrayModel.length === 1){
    var modelname = arrayModel[0].modelName;
    var query = arrayModel[0].query;
    var url = baseUrl + modelname + '?where' 
            + JSON.stringify(query) + '&filter=' + JSON.stringify(_limit);
    httpGetAsync(ref, url, callback);
  }
  else if(arrayModel.length > 1){
    joinExampleMulti(ref, arrayModel, callback);
  }
  else{
    return null; 
  }
}

function joinExampleMulti(ref, arrayModel, callback){
  var result = [];
  for(var i = 0; i < arrayModel.length; i++){
    var modelname = arrayModel[i].modelName;
    var query = arrayModel[i].query;
    var url = baseUrl + modelname + '?where' 
            + JSON.stringify(query) + '&filter=' + JSON.stringify(_limit);
    var response = JSON.parse(httpGet(url));
    result = cartesian(result, response, i);
  }
  callback(ref, result);
}

function cartesian(baseArray, newArray, postFix){
  if(baseArray.length === 0 && newArray.length === 0) return [];
  if(baseArray.length === 0 && newArray.length !== 0) return newArray.slice();
  var tmp = [];
  for(var i = 0; i < baseArray.length; i++){
    for(var j = 0; j < newArray.length; j++){
      var baseObj = JSON.parse(JSON.stringify(baseArray[i]));
      for (var k in newArray[j]){
        if (newArray[j].hasOwnProperty(k)) {
          if((Object.keys(baseObj)).indexOf(k + '') != -1){ // exist
            baseObj[k + '' + postFix] = newArray[j][k];
          }
          else{
            baseObj[k + ''] = newArray[j][k];
          }
        }
      }
      tmp.push(baseObj);
    }
  }
  newArray = []; newArray = []; // alloc
  return tmp;
}



















