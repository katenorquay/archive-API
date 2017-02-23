var unirest = require('unirest')

function waybackAPI(url, generatedUrls, callback) {
  waybackUrls = []
  waybackTimeStamps = []
  slowDownLoop()
  function slowDownLoop() {
    for (var i = 0; i < generatedUrls.length; i++) {
      (function(i) {
        setTimeout(function() {
          unirest.get(generatedUrls[i])
            .header("X-Mashape-Key", process.env.MASHAPE_KEY)
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .end(function (result, error) {
              if (error) console.log(error)
              var obj = JSON.parse(result.body)
              var saveUrl = obj.archived_snapshots.closest.url
              var saveTimeStamp = obj.archived_snapshots.closest.timestamp
                waybackUrls.push(saveUrl)
                waybackTimeStamps.push(saveTimeStamp)
                if (waybackUrls.length === generatedUrls.length) {
                  console.log(waybackUrls)
                  callback(waybackTimeStamps, waybackUrls)
              }
            })
        }, i * 3000)
      }(i))
    }
  }
}

module.exports = waybackAPI
