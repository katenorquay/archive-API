var designs = require('./data.js')

sorter(designs)


function sorter(designs) {
var filtered = designs.filter(function (item, position) {
    return designs.indexOf(item) == position;
  })
hello(filtered)
}

function hello(filtered) {
  console.log(filtered)
}

// function sorter(designs) {
  // var cutDesigns = designs.splice(0, 18)
//   var years = cutDesigns.map(function (item) {
//     return item.year
//   })
//     var uniqueArray = cutDesigns.year.filter(function (item, position) {
//       return cutDesigns.year.indexOf(item) == position;
//     })
//   }
//   console.log(uniqueArray)
// }

// function sorter(designs) {
//    var cutDesigns = designs.splice(0, 18)
//    return cutDesigns.filter(function (item, position) {
//      return cutDesigns.year.indexOf(item) == position
//    })
//    console.log(cutDesigns)
// }

// function sorter(designs) {
//   var cutDesigns = designs.splice(0, 18)
//   var newArray = []
//   for (var i = 0; i < cutDesigns.length; i++) {
//     if(cutDesigns[i].year.indexOf(cutDesigns[i]) == i) {
//       newArray.push(cutDesigns[i])
//     }
//   }
//   console.log(newArray)
// }



// homes.filter(function (el) {
//   return el.price <= 1000 &&
//          el.sqft >= 500 &&
//          el.num_of_beds >=2 &&
//          el.num_of_baths >= 2.5;
// });

// for (var i = 0; i < uniqueArray.length; i++) {
//   var completeArray = []
//   console.log(uniqueArray[i], cutDesigns[i].year)
//   if (uniqueArray[i] === cutDesigns[i].year) {
//     completeArray.push(cutDesigns[i])
//   }
// }



// for (var i = 0; i < cutDesigns.length - 1; i++) {
//   console.log(cutDesigns[i].year, cutDesigns[i + 1].year)
//   if (cutDesigns[i].year === cutDesigns[i + 1].year) {
//     cutDesigns.splice(cutDesigns[i], 1)
//   }
// }
// console.log(cutDesigns)
