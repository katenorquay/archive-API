// var unirest = require('unirest')
// var designDB = require('./db/data')
//
//
// function prepUrls (url, practiceStamps, waybackAPI) {
//   console.log('prepUrls');
//   var generatedUrls = []
//   practiceStamps.map(function (stamp) {
//   generatedUrls.push('http://archive.org/wayback/available?url=' + url + '&timestamp=' + stamp)
//   })
//    waybackAPI(url, generatedUrls, practiceStamps, screenshotAPI)
// }
//
// function waybackAPI(url, generatedUrls, practiceStamps, screenshotAPI) {
//   console.log('waybackAPI');
//   waybackUrls = []
//   waybackTimeStamps = []
//   slowDownLoop()
//   function slowDownLoop() {
//     for (var i = 0; i < generatedUrls.length; i++) {
//       (function(i) {
//         setTimeout(function() {
//           unirest.get(generatedUrls[i])
//             .header("X-Mashape-Key", process.env.WAYBACK_KEY)
//             .header("Content-Type", "application/json")
//             .header("Accept", "application/json")
//             .end(function (result, error) {
//               if (error) console.log(error)
//               console.log(result.body)
//               var obj = JSON.parse(result.body)
//               var saveUrl = obj.archived_snapshots.closest.url
//               var saveTimeStamp = obj.archived_snapshots.closest.timestamp
//                 waybackUrls.push(saveUrl)
//                 waybackTimeStamps.push(saveTimeStamp)
//                 if (waybackUrls.length === generatedUrls.length) {
//                 screenshotAPI(url, waybackUrls, waybackTimeStamps, sliceYears)
//               }
//             })
//         }, i * 7000)
//       }(i))
//     }
//   }
// }
//
// function screenshotAPI(url, waybackUrls, waybackTimeStamps, sliceYears) {
//   console.log('screenshotAPI')
//     var screenshotUrls = []
//     slowDownLoop()
//     function slowDownLoop() {
//       for (var i = 0; i <= waybackUrls.length - 1; i++) {
//         (function (i) {
//           setTimeout(function() {
//             unirest.get("https://browshot.p.mashape.com/screenshot/create?key=" + process.env.SCREENSHOT_KEY + "&size=screen&url=" + waybackUrls[i])
//             .header("X-Mashape-Key", "jck1cRFtf9mshwM3hisuUlxrbfvFp1KPMMpjsnBCYT96FUecP6")
//             .header("Accept", "application/json")
//             .end(function (result, error) {
//               if(error) console.log(error)
//               var screenshot_url = result.body.screenshot_url
//               screenshotUrls.push(screenshot_url)
//               if (screenshotUrls.length === waybackUrls.length) {
//                sliceYears(url, waybackTimeStamps, screenshotUrls, makeDbObject)
//               }
//             })
//           }, i * 7000)
//         }(i))
//       }
//
//     }
//   }
//
// function sliceYears(url, waybackTimeStamps, screenshotUrls, makeDbObject) {
//   console.log('sliceYears')
//   var years = []
//   waybackTimeStamps.map(function (stamp) {
//     years.push(stamp.slice(0, 4))
//   })
//   makeDbObject(url, waybackTimeStamps, screenshotUrls, years)
// }
//
// function makeDbObject(url, waybackTimeStamps, screenshotUrls, years) {
//   console.log('dbObject')
//   var designObjects = []
//   for (var i = 0; i < years.length; i++) {
//     var designObj = {
//       "image_url": screenshotUrls[i],
//       "page_url": url,
//       "year": years[i],
//       "timestamp": waybackTimeStamps[i]
//     }
//     designObjects.push(designObj)
//     }
//     intoDB(designObjects)
//   }
// }
//
//
//
// module.exports = {
//   prepUrls: prepUrls,
//   waybackAPI: waybackAPI,
//   screenshotAPI: screenshotAPI,
//   sliceYears: sliceYears,
//   makeDbObject: makeDbObject
// }
