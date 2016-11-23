function iterateTimeStamps(starttimestamp, stoptimestamp, frequency) {
  var timestampsArray = []
    for (var i = Number(starttimestamp); i <= stoptimestamp; i++) {
      timestampsArray.push(i)
    }
      return iterateYearlyStamps(timestampsArray, frequency)
}

  function iterateYearlyStamps(timestampsArray, frequency) {
    return timestampsArray.map(function (timestamp)  {
      return timestamp += '0615'
    })
  }

module.exports = {
  iterateTimeStamps: iterateTimeStamps,
  iterateYearlyStamps: iterateYearlyStamps,
}
