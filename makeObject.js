function makeObject(submittedUrl, waybackTimeStamps, grabbedYears, realUrls) {
  var objectArray = []
  for (var i = 0; i < waybackTimeStamps.length; i++) {
    var newObj = {
    "image_url": realUrls[i],
    "page_url": submittedUrl,
    "year": grabbedYears[i],
    "timestamp": waybackTimeStamps[i]
    };
    objectArray.push(newObj)
  }
  console.log(objectArray)
  return objectArray
}

module.exports = makeObject
