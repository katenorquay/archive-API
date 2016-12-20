var unirest = require('unirest')

const practiceStamps = [200950615, 20100615, 20110615]

prepUrls('imgur.com', practiceStamps, waybackAPI)

function prepUrls (url, practiceStamps, waybackAPI) {
  var generatedUrls = []
  practiceStamps.map(function (stamp) {
  generatedUrls.push('http://archive.org/wayback/available?url=' + url + '&timestamp=' + stamp)
  })
  console.log(generatedUrls)
  waybackAPI(url, generatedUrls)
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
                  // screenshotAPI(url, waybackUrls, waybackTimeStamps, imgurAPI)
              }
            })
        }, i * 5000)
      }(i))
    }
  }
}

// function screenshotAPI(url, waybackUrls, waybackTimeStamps, imgurAPI) {
  //   console.log('screenshotAPI')
  //   var screenshotUrls = []
  //   slowDownLoop()
  //   function slowDownLoop() {
  //     for (var i = 0; i <= waybackUrls.length - 1; i++) {
  //       (function (i) {
  //         setTimeout(function() {
  //           unirest.get('http://api.screenshotmachine.com/?key=26717d&size=N&format=JPG&hash=&cacheLimit=1&timeout=400&url=' + waybackUrls[i])
  //           .end(function (result) {
  //             console.log(result.body)
  //           })
  //           // screenshotUrls.push(imgUrl)
  //           // if(screenshotUrls.length === waybackUrls.length) {
  //           //   console.log(screenshotUrls)
  //           //   imgurAPI()
  //           // }
  //         }, i * 5000)
  //       }(i))
  //     }
  //
  //   }
  // }


function imgurAPI() {
  console.log('imgure with nothing yet')
}

// function callScreenshotAPI(submittedUrl, waybackUrls, waybackTimeStamps) {
//   console.log('screenshotAPI')
//   var screenshotUrls = []
//     for (var i = 0; i <= waybackUrls.length - 1; i++) {
//           var options = {
//             url: waybackUrls[i],
//             thumb_width: 600,
//             format: 'jpg',
//             quality: 100
//           };
//           const imgUrl = urlbox.buildUrl(options)
//           if (screenshotUrls.length < waybackUrls.length) {
//             screenshotUrls.push(imgUrl)
//           }
//     }
//     callImgurAPI(submittedUrl, waybackTimeStamps, screenshotUrls)
// }
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
// function collectAllData(submittedUrl, waybackTimeStamps, realUrls) {
//   grabbedYears = []
//   for (var i = 0; i < waybackTimeStamps.length; i++) {
//     grabbedYears.push(waybackTimeStamps[i].slice(0, 4))
//   }
//   makeObject(submittedUrl, waybackTimeStamps, grabbedYears, realUrls)
// }
