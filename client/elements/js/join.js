
var baseUrl = '/api/';
var limitRecord = 10;
var limitRecordPerRequest = 10;
var forceStop = false;

function js_stopWork(){
  forceStop = true;
}

function js_distinct(ref, model, attribute, sortBy, callback){
  var url = baseUrl + model + '?filter[fields][' + attribute + ']=true';
  httpGetAsync(ref, url, function(ref, msg){
    var data = JSON.parse(msg);
    var result = [];
    for(var i = 0; i < data.length; i++){
      if(result.indexOf(data[i][attribute]) == -1){
        result.push(data[i][attribute]);
      }
    }
    result.sort(function(a,b){return a.localeCompare(b);});
    if(sortBy === 'descendant'){
      result.reverse();
    }
    callback(ref, result);
  });
}

function js_fullWork(ref, arrayModel, startIndex, endIndex, callback){
  if(forceStop) {
    forceStop = false; return;
  }
  var devide = 0, countRecord = 1;
  for(var i = 0; i < arrayModel.length; i++){
    var url = baseUrl + arrayModel[i].modelName + '/count';
    var _count = (JSON.parse(httpGet(url))).count;
    if(_count !== 0){
      countRecord *= _count;
    }
    arrayModel[i]['order'] = i;
    arrayModel[i]['count'] = _count;
    if(arrayModel[i].query.where){
      url = baseUrl + arrayModel[i].modelName + '/count?where=' + JSON.stringify(arrayModel[i].query.where);
      arrayModel[i]['countQuery'] = (JSON.parse(httpGet(url))).count;
    }
    else{
      arrayModel[i]['countQuery'] = _count;
    }
    arrayModel[i]['beginStart'] = findRequestIndex(startIndex, _count, devide);
    arrayModel[i]['beginEnd'] = findRequestIndex(endIndex, _count, devide);
    arrayModel[i]['range'] = findRange(arrayModel[i]['beginStart'], arrayModel[i]['beginEnd'], endIndex-startIndex, _count);
    devide += _count;
  }
  callback(ref, generateRequest(arrayModel, startIndex, endIndex), countRecord);
}

function generateRequest(arrayModel, startIndex, endIndex){
  var result = [];
  var skipRecord = 0;
  var resultRange = (endIndex - startIndex) + 1;
  for(var i = 0; i < arrayModel.length; i++){
    var range = arrayModel[i].range;
    var merge = [];
    for(var j = 0; j < range.length; j++){
      var start = range[j].start;
      var end = range[j].end;
      arrayModel[i].query['limit'] = (end-(start-1));
      arrayModel[i].query['skip'] =  (start-1);
      var url = baseUrl + arrayModel[i].modelName + '?filter=' 
            + JSON.stringify(arrayModel[i].query);
      merge = mergeArray(merge, JSON.parse(httpGet(url)));
    }
    if(i === 1){
      var oldStart = arrayModel[i-1].range[0].start;
      skipRecord = arrayModel[i-1].range[0].end;
      if(oldStart < skipRecord){
        skipRecord = oldStart;
      }
    }
    result = cartesian(result, merge, i);
    if(result.length > resultRange){
      result = result.slice(skipRecord-1, resultRange);
    }
  }
  return result;
}
 
function generateRequestParallel(arrayModel, startIndex, endIndex){
  var result = [];
  var index = [];
  var skipRecord = 0;
  var resultRange = (endIndex - startIndex) + 1;
  for(var i = 0; i < arrayModel.length; i++){
    index.push(i);
    var range = arrayModel[i].range;
    var task = [], urls = [];
    
    // get first index of record
    if(i === 1){
      var oldStart = arrayModel[i-1].range[0].start;
      skipRecord = arrayModel[i-1].range[0].end;
      if(oldStart < skipRecord){
        skipRecord = oldStart;
      }
    }
    
    // collect url
    for(var j = 0; j < range.length; j++){
      var start = range[j].start;
      var end = range[j].end;
      var url = baseUrl + arrayModel[i].modelName + '?filter=' 
            + JSON.stringify(arrayModel[i].query) 
            + '&[limit]=' + (end-(start-1))+ '&[skip]=' + (start-1);
      urls.push(url);
    }
    // generate task each url
    for(var k = 0; k < urls.length; k++){
      task.push(
        function(callback){
          callback(null, JSON.parse(httpGet(urls.pop())));
        }
      );
    }

    // call as parall
    async.parallel(task,
      function(err, results){
        var merge = [];
        for(var i = 0; i < results.length; i++){
          merge = mergeArray(merge, results[i]);
        }
        result = cartesian(result, merge, index.pop());
        if(result.length > resultRange){
          result = result.slice(skipRecord-1, resultRange);
        }
      }
    );
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

function findRequestIndex(findValue, count, devide){
  var devideWithCount = devide * count;
  if(devide === 0) {
    devide = 1;
    devideWithCount = count;
  }
  var result = Math.ceil((findValue - (devideWithCount*Math.floor(findValue/devideWithCount)))/devide);
  if(result === 0 && devide === 1) {
    result = findValue; // findValue = count
  }
  else if(result === 0) {
    result = 1;
  }
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
  else if(startIndex <= endIndex){
    return [{'start':startIndex,'end':endIndex}];
  }
}

function splitRange(ranges){ // not finish
  var newRange = [];
  for(var i = 0; i < ranges.length; i++){
    var tmp = ranges[i];
    if((tmp.end-tmp.start) >= limitRecordPerRequest){
      
    }
  }
}


















