var unirest = require('unirest')

const practiceStamps = [20100615, 20110615]

prepUrls('imgur.com', practiceStamps, waybackAPI)

function prepUrls (url, practiceStamps, waybackAPI) {
  var generatedUrls = []
  practiceStamps.map(function (stamp) {
  generatedUrls.push('http://archive.org/wayback/available?url=' + url + '&timestamp=' + stamp)
  })
  console.log(generatedUrls)
  waybackAPI(url, generatedUrls, screenshotAPI)
}

function waybackAPI(url, generatedUrls, screenshotAPI) {
  waybackUrls = []
  waybackTimeStamps = []
  slowDownLoop()
  function slowDownLoop() {
    for (var i = 0; i < generatedUrls.length; i++) {
      (function(i) {
        setTimeout(function() {
          unirest.get(generatedUrls[i])
            .header("X-Mashape-Key", process.env.WAYBACK_KEY)
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
                  console.log(waybackUrls, waybackTimeStamps)
                  screenshotAPI(url, waybackUrls, waybackTimeStamps, imgurAPI)
              }
            })
        }, i * 5000)
      }(i))
    }
  }
}

function screenshotAPI(url, waybackUrls, waybackTimeStamps, imgurAPI) {
    console.log('screenshotAPI')
    var screenshotUrls = []
    slowDownLoop()
    function slowDownLoop() {
      for (var i = 0; i <= waybackUrls.length - 1; i++) {
        (function (i) {
          setTimeout(function() {
            unirest.get("https://browshot.p.mashape.com/screenshot/create?key=pJRxC3T5uZVPhNxLiicMJV7Sn8Rz6zg8&size=screen&url=" + waybackUrls[i])
            .header("X-Mashape-Key", "jck1cRFtf9mshwM3hisuUlxrbfvFp1KPMMpjsnBCYT96FUecP6")
            .header("Accept", "application/json")
            .end(function (result, error) {
              if(error) console.log(error)
              var screenshot_url = result.body.screenshot_url
              screenshotUrls.push(screenshot_url)
              if (screenshotUrls.length === waybackUrls.length) {
                console.log(screenshotUrls)
              }
            })
          }, i * 5000)
        }(i))
      }

    }
  }


function imgurAPI() {
  console.log('imgur with nothing yet')
}

// function collectAllData(submittedUrl, waybackTimeStamps, realUrls) {
//   grabbedYears = []
//   for (var i = 0; i < waybackTimeStamps.length; i++) {
//     grabbedYears.push(waybackTimeStamps[i].slice(0, 4))
//   }
//   makeObject(submittedUrl, waybackTimeStamps, grabbedYears, realUrls)
// }

// function makeObject(submittedUrl, waybackTimeStamps, grabbedYears, realUrls) {
//   var objectArray = []
//   for (var i = 0; i < waybackTimeStamps.length; i++) {
//     var newObj = {
//     "image_url": realUrls[i],
//     "page_url": submittedUrl,
//     "year": grabbedYears[i],
//     "timestamp": waybackTimeStamps[i]
//     };
//     objectArray.push(newObj)
//   }
//   console.log(objectArray)
//   return objectArray
// }
//
// module.exports = makeObject
//
//

// function callImgurAPI(submittedUrl, waybackTimeStamps, screenshotUrls) {
//   console.log('Made it to imgur!')
//   var realUrls = []
//   for (var i = 0; i <= screenshotUrls.length - 1; i++) {
//     unirest.post('https://imgur-apiv3.p.mashape.com/3/image')
//     .header("X-Mashape-Key", process.env.IMGUR_KEY)
//     .header("Authorization", "Client-ID process.env.IMGUR_CLIENT_ID")
//     .attach("image", screenshotUrls[i])
//     .end(function (result) {
//       var realUrl = result.body.data.link
//       if (realUrls.length < screenshotUrls.length) {
//         realUrls.push(realUrl)
//         if(realUrls.length === screenshotUrls.length) {
//           collectAllData(submittedUrl, waybackTimeStamps, realUrls)
//         }
//       }
//     });
//   }
// }
//
