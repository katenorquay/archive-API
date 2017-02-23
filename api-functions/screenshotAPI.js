var Urlbox = require('urlbox')

function screenshotAPI(unduplicatedUrls, callback) {
  var screenshotUrls = []
  slowDownLoop()
  function slowDownLoop() {
    for (var i = 0; i <= unduplicatedUrls.length - 1; i++) {
      (function (i) {
        setTimeout(function() {
          const urlbox = Urlbox(process.env.SCREENSHOT_KEY, process.env.SCREENSHOT_SECRET);
          const options = {
            url: unduplicatedUrls[i],
            thumb_width: 600,
            format: 'jpg',
            quality: 80,
            hide_selector: 'div#wm-ipp-inside'
          };
          const imgUrl = urlbox.buildUrl(options);
          screenshotUrls.push(imgUrl)
          console.log(screenshotUrls)
          if (screenshotUrls.length === unduplicatedUrls.length) {
            callback(screenshotUrls)
          }
        }, i * 7000)
      }(i))
    }
  }
}

module.exports = screenshotAPI
