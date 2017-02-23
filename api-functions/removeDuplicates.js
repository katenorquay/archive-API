function removeDuplicates(waybackUrls) {
  var unduplicatedUrls = waybackUrls.filter(function (item, position) {
      return waybackUrls.indexOf(item) == position;
    })
    return unduplicatedUrls
}

module.exports = removeDuplicates
