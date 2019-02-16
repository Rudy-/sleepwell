var fs = require("fs");

const hotelsJSON = require('./castle.js')();
const restaurantsJSON = require("./restaurant.js")();


const starredCastles = findMutualChefsAndCity(hotelsJSON, restaurantsJSON);

fs.writeFileSync(
  "data/starredCastle.json", JSON.stringify(starredCastles)
);

function findMutualChefsAndCity(hotelsList, restaurantsList) {
  var starredCastles = [];

  for(var i = 0; i < hotelsList.length; i++) {
    for(var j = 0; j < restaurantsList.length; j++) {
      if(hotelsList[i].chef === restaurantsList[j].chef && hotelsList[i].postalCode === restaurantsList[j].postalCode) {
        starredCastles.push({
          id: i,
          hotelName: hotelsList[i].name,
          restaurantName: restaurantsList[j].name,
          postalCode: hotelsList[i].postalCode,
          chef: hotelsList[i].chef,
          url: hotelsList[i].url,
          priceRange: hotelsList[i].priceRange,
          imageUrl: hotelsList[i].imageUrl,
          description: hotelsList[i].description,
          restaurantUrl: restaurantsList[j].url,
          restaurantPrices: restaurantsList[j].priceRange,
          nbStars: restaurantsList[j].nbStars,
          lat: restaurantsList[j].lat,
          lng: restaurantsList[j].lng,
          address: hotelsList[i].address
        });
      }
    }
  }

  return starredCastles;
}

module.exports.starredCastles = starredCastles;