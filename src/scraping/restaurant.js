// Librairies
const Promise = require("promise");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

var promisesList = [];
var indivPromisesList = [];

var restaurantsList = [];

function createPromise() {
    for(var i = 1; i <= 37; i++) {
        let url = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-" + i.toString();

        promisesList.push(fillRestaurantsList(url));
    }
}

function createIndividualPromises() {
    return new Promise(function(resolve, reject) {
      for(var i = 0; i < restaurantsList.length; i++) {
        let restaurantURL = restaurantsList[i].url;
        
        indivPromisesList.push(
          fillRestaurantInfo(restaurantURL, i)
        );

        resolve();
      }
    });
}

function fillRestaurantsList(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, result, html) {
            if(error) {
                console.error(error.message);
            
                return reject(error);
            } else if(result.statusCode !== 200) {
                error = new Error("Error (status) : " + result.statusCode);
       
                error.result = result;
        
                return reject(error);
            }
    
            var $ = cheerio.load(html);
    
            $(".poi-card-link").each(function() {
                let data = $(this);
                let link = data.attr("href");
                let url = "https://restaurant.michelin.fr/" + link;
        
                restaurantsList.push({
                    name: "",
                    postalCode: "",
                    chef: "",
                    url: url,
                    nbStars: "",
                    priceRange: "",
                    lat: "",
                    lng: "",
                    address: ""
                });
            });
            
            resolve(restaurantsList);
        });
    });
}

function fillRestaurantInfo(url, index) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, result, html) {
       
        if(error) {
          console.error(error.message);
          
          return reject(error);
        } else if(result.statusCode !== 200) {
          error = new Error("Error (status) : " + result.statusCode);
          
          console.error(error.message);
          error.result = result;
          
          return reject(error);
        }
  
        const $ = cheerio.load(html);
        
        $(".poi_intro-display-title")
          .first()
          .each(function() {
            let data = $(this);
            let name = data.text();
            
            name = name.replace(/\n/g, "");
            
            restaurantsList[index].name = name.trim();
          });
  
        $(".postal-code")
          .first()
          .each(function() {
            let data = $(this);
            let pc = data.text();
            
            restaurantsList[index].postalCode = pc;
          });
  
        $("#node_poi-guide-wrapper > div.node_poi-distinction-section > ul > li:nth-child(1) > div.content-wrapper")
          .first()
          .each(function() {
            let data = $(this);
            let nbStars = data.text().split(" ")[0];
            
            restaurantsList[index].nbStars = nbStars;
          });
  
        $('span[itemprop="priceRange"]')
          .first()
          .each(function() {
            let data = $(this);
            let price = data.text();
            
            restaurantsList[index].priceRange = String(price.split("-")[1]).trim();
          });
  
        $('meta[itemprop="latitude"]')
          .first()
          .each(function() {
            let data = $(this);
            let lat = data.attr("content");
            
            restaurantsList[index].lat = String(lat);
          });
  
        $('meta[itemprop="longitude"]')
          .first()
          .each(function() {
            let data = $(this);
            let lng = data.attr("content");
            
            restaurantsList[index].lng = String(lng);
          });
  
        $("#node_poi-menu-wrapper > div.node_poi-chef > div.node_poi_description > div.field.field--name-field-chef.field--type-text.field--label-above > div.field__items > div")
          .first()
          .each(function() {
            let data = $(this);
            let chefName = data.text();
            
            restaurantsList[index].chef = chefName;
          });

          resolve(restaurantsList);
      });
    });
  }

function saveRestaurantsInJson() {
    return new Promise(function(resolve, reject) {
      try {
        var jsonRestaurants = JSON.stringify(restaurantsList);
       
        fs.writeFile(
          "./data/restaurant.json",
          jsonRestaurants,
          function doneWriting(error) {
            if(error) {
              console.log(error);
            }
          }
        );
      } catch(error) {
        console.error(error);
      }
      
      resolve();
    });
  }
  
  createPromise();
  
  var prom = promisesList[0];
  
  prom
    .then(createIndividualPromises)
    .then(() => {
      return Promise.all(indivPromisesList);
    })
    .then(createIndividualPromises)
    .then(() => {
      return Promise.all(indivPromisesList);
    })
    .then(saveRestaurantsInJson)
    .then(() => {
      console.log("Success : data stored in a JSON file");
    });
  
  module.exports = function() {
    return JSON.parse(fs.readFileSync("./data/restaurant.json"));
  };