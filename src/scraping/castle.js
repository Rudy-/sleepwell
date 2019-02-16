// Libraries
var Promise = require("promise");
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

var promisesList = [];
var indivPromisesList = [];

var castlesList = [];

var scrapingRound = 1;

function createPromise() {
  let url = "https://www.relaischateaux.com/fr/site-map/etablissements";

  promisesList.push(fillcastlesList(url));
}

function createIndividualPromises() {
  return new Promise(function(resolve, reject) {
    if(scrapingRound === 1) {
      for(var i = 0; i < Math.trunc(castlesList.length / 2); i++) {
        let castleURL = castlesList[i].url;

        indivPromisesList.push(fillCastleInfo(castleURL, i));
      }

      resolve();

      scrapingRound++;
    } else if(scrapingRound === 2) {
      for(i = castlesList.length / 2; i < Math.trunc(castlesList.length); i++) {
        let castleURL = castlesList[i].url;

        indivPromisesList.push(fillCastleInfo(castleURL, i));
      }

      resolve();

      scrapingRound++;
    }
  });
}

function fillcastlesList(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(error, result, html) {
      if(error) {
        console.log(error);

        return reject(error);
      } else if(result.statusCode !== 200) {
        error = new Error("Error (status) : " + result.statusCode);

        error.result = result;

        return reject(error);
      }

      var $ = cheerio.load(html);

      $('h3:contains("France")')
        .next()
        .find("li")
        .each(function() {
          let data = $(this);
          let url = String(data.find("a").attr("href"));

          let name = data
            .find("a")
            .first()
            .text();
          name = name.replace(/\n/g, "");

          let chefname = String(
            data
              .find('a:contains("Chef")')
              .text()
              .split(" - ")[1]
          );
          chefname = chefname.replace(/\n/g, "");

          castlesList.push({
            name: name.trim(),
            postalCode: "",
            chef: chefname.trim(),
            url: url,
            imageUrl: "",
            priceRange: "",
            description: ""
          });
        });
      resolve(castlesList);
    });
  });
}

function fillCastleInfo(url, index) {
  return new Promise(function(resolve, reject) {
    request(url, function(error, result, html) {
      if(error) {
        console.error(error);

        return reject(error);
      } else if(result.statusCode !== 200) {
        error = new Error("Error (status) : " + result.statusCode);

        error.result = result;

        console.log(result.statusCode);

        return reject(error);
      }

      const $ = cheerio.load(html);

      $('span[itemprop="postalCode"]')
        .first()
        .each(function() {
          let data = $(this);
          let pc = data.text();

          castlesList[index].postalCode = String(pc.split(",")[0]).trim();
        });

      $(".richTextMargin")
        .first()
        .each(function() {
          let data = $(this);
          let desc = data.text();

          castlesList[index].description = desc.trim();
        });

      $(".ajaxPages")
        .find('[itemprop="priceRange"]')
        .first()
        .each(function() {
          let data = $(this);
          let priceRange = String(data.attr("content"));

          castlesList[index].priceRange = priceRange;
        });

      $('span[itemprop="addressLocality"]')
      .first()
      .each(function() {
        let data = $(this);
        let address = data.text();
        castlesList[index].address = address;
      });

      $("head")
        .find('meta[property="og:image"]')
        .first()
        .each(function() {
          let data = $(this);
          let imageurl = String(data.attr("content"));
          castlesList[index].imageUrl = imageurl;
        });

        resolve(castlesList);
    });
  });
}

function saveCastlesInJson() {
  return new Promise(function(resolve, reject) {
    try {
      var jsonCastles = JSON.stringify(castlesList);
     
      fs.writeFile(
        "./data/castle.json",
        jsonCastles,
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
  .then(saveCastlesInJson)
  .then(() => {
    console.log("Success : data stored in a JSON file");
  });

module.exports = function() {
  return JSON.parse(fs.readFileSync("./data/castle.json"));
};