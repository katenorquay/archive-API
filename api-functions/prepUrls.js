function prepUrls (url, timestamps) {
  var generatedUrls = []
  timestamps.map(function (stamp) {
  generatedUrls.push('http://archive.org/wayback/available?url=' + url + '&timestamp=' + stamp)
  })
  return generatedUrls
}

module.exports = prepUrls
