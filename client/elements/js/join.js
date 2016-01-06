
var baseUrl = '/api/';
var limitRecord = 10;

function js_joinExample(ref, arrayModel, callback){
  if(arrayModel.length === 1){
    var modelname = arrayModel[0].modelName;
    var query = arrayModel[0].query;
    var url = baseUrl + modelname + '?where' 
            + JSON.stringify(query) + '&filter[limit]=' + limitRecord;
    httpGetAsync(ref, url, callback);
  }
  else if(arrayModel.length > 1){
    callback(ref, joinExampleMulti(arrayModel));
  }
  else{
    return null; 
  }
}

function joinExampleMulti(arrayModel){
  var result = [];
  for(var i = 0; i < arrayModel.length; i++){
    var modelname = arrayModel[i].modelName;
    var query = arrayModel[i].query;
    var url = baseUrl + modelname + '?where' 
            + JSON.stringify(query) + '&filter[limit]=' + limitRecord;
    var response = JSON.parse(httpGet(url));
    result = cartesian(result, response, i);
  }
  return result;
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

function js_fullWork(arrayModel, startIndex, endIndex){
  // get records
  var devide = 0;
  for(var i = 0; i < arrayModel.length; i++){
    var url = baseUrl + arrayModel[i].modelName + '/count';
    var _count = (JSON.parse(httpGet(url))).count;
    
    arrayModel[i]['order'] = 'S' + i;
    arrayModel[i]['count'] = _count;
    arrayModel[i]['start'] = findRequestIndex(startIndex, _count, devide);
    arrayModel[i]['end'] = findRequestIndex(endIndex, _count, devide);
    devide += _count;
  }
  
  console.log(arrayModel);
}

function findRequestIndex(findValue, count, devide){
  var devideWithCount = devide * count;
  if(devide === 0) {
    devide = 1;
    devideWithCount = count;
  }
  return Math.floor((findValue - (devideWithCount*Math.floor(findValue/devideWithCount)))/devide);
}


















