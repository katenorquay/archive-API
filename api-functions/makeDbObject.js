function makeDbObject(url, unduplicatedUrls, waybackTimeStamps, screenshotUrls, years) {
  var designObjects = []
    for (var i = 0; i < years.length; i++) {
      var designObj = {
        "image_url": screenshotUrls[i],
        "page_url": url,
        "wayback_url": unduplicatedUrls[i],
        "year": years[i],
        "timestamp": waybackTimeStamps[i]
      }
      designObjects.push(designObj)
    }
    return designObjects
}

module.exports = makeDbObject
