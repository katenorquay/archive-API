function sliceYears(waybackTimeStamps) {
  var years = []
  waybackTimeStamps.map(function (stamp) {
    years.push(stamp.slice(0, 4))
  })
  return years
}

module.exports = sliceYears
