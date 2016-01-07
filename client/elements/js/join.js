
var baseUrl = '/api/';
var limitRecord = 10;

function js_fullWork(ref, arrayModel, startIndex, endIndex, callback){
  var devide = 0;
  for(var i = 0; i < arrayModel.length; i++){
    var url = baseUrl + arrayModel[i].modelName + '/count';
    var _count = (JSON.parse(httpGet(url))).count;
    arrayModel[i]['order'] = i;
    arrayModel[i]['count'] = _count;
    arrayModel[i]['beginStart'] = findRequestIndex(startIndex, _count, devide);
    arrayModel[i]['beginEnd'] = findRequestIndex(endIndex, _count, devide);
    arrayModel[i]['range'] = findRange(arrayModel[i]['beginStart'], arrayModel[i]['beginEnd'], endIndex-startIndex, _count);
    devide += _count;
  }
  callback(ref, generateRequest(arrayModel));
}

function js_joinExample(ref, arrayModel, callback){
  if(arrayModel.length === 1){
    var modelname = arrayModel[0].modelName;
    var query = arrayModel[0].query;
    var url = baseUrl + modelname + '?where=' 
            + JSON.stringify(query) + '&filter[limit]=' + limitRecord;
    httpGetAsync(ref, url, callback);
  }
  else if(arrayModel.length > 1){
    callback(ref, generateRequestExample(arrayModel));
  }
  else{
    return null; 
  }
}

function generateRequestExample(arrayModel){
  var result = [];
  for(var i = 0; i < arrayModel.length; i++){
    var url = baseUrl + arrayModel[i].modelName + '?where=' 
            + JSON.stringify(arrayModel[i].query) + '&filter[limit]=' + limitRecord;
    var response = JSON.parse(httpGet(url));
    result = cartesian(result, response, i);
  }
  return result;
}

function generateRequest(arrayModel){
  var result = [];
  for(var i = 0; i < arrayModel.length; i++){
    var range = arrayModel[i].range;
    var merge = [];
    for(var j = 0; j < range.length; j++){
      var start = range[j].start;
      var end = range[j].end;
      var url = baseUrl + arrayModel[i].modelName + '?where=' 
            + JSON.stringify(arrayModel[i].query) 
            + '&filter[limit]=' + (end-start+1)+ '&filter[skip]=' + start;
      merge = mergeArray(merge, JSON.parse(httpGet(url)));
    }
    result = cartesian(result, merge, i);
  }
  return result;
}

function mergeArray(array1, array2){
  var tmp = array1.slice();
  for(var i = 0; i < array2.length; i++){
    tmp.push(array2[i]);
  }
  return tmp;
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

function findActualIndex(findValue, count, devide, isStartIndex, defaultValue){
  if(devide === 0) devide = 1;
  var value = Math.floor(findValue/devide);
  if(value >= count){
    if(isStartIndex) return 1;
    return count;
  }
  return defaultValue;
}

function findRequestIndex(findValue, count, devide){
  var devideWithCount = devide * count;
  if(devide === 0) {
    devide = 1;
    devideWithCount = count;
  }
  var result = Math.floor((findValue - (devideWithCount*Math.floor(findValue/devideWithCount)))/devide);
  if(result === 0) result = 1;
  return result;
}

function findRange(startIndex, endIndex, range, count){
  if(count <= range) return [{'start':1,'end':count}];
  if(startIndex > endIndex){
    return [
        {'start':1,'end':endIndex},
        {'start':startIndex,'end':count}
      ];
  }
  else if(startIndex < endIndex){
    return [{'start':startIndex,'end':endIndex}];
  }
  else{
    return [{'start':1,'end':1}];
  }
}


















