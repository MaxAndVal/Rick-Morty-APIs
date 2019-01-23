const connection = require("../../dbConnexion");
const axios = require("axios");
const KAAMELOTT_PERSONNAGES = require("../constants/kaamelottPersonnages");

async function getRandomPersonnage(response) {
  const citation = response.data.citation.citation;
  const personnage = response.data.citation.infos.personnage;
  if (!personnage) {
    return await getRandomQuote();
  } else {
    let personnages = [];
    let i = 0;
    while (i < 3) {
      let personnageTemp =
        KAAMELOTT_PERSONNAGES[Math.floor(Math.random() * KAAMELOTT_PERSONNAGES.length)];
      if (!personnages.includes(personnageTemp) && personnageTemp !== personnage) {
        personnages = personnages.concat(personnageTemp);
        i++;
      }
    }
    return { citation, personnage, personnages };
  }
}

async function getRandomQuote() {
  return new Promise(async (resolve, reject) => {
    axios.get("https://kaamelott.chaudie.re/api/random").then(response =>
      getRandomPersonnage(response)
        .then(response => {
          resolve({
            code: 200,
            message: "sucess",
            citation: response.citation,
            personnage: response.personnage,
            personnages: response.personnages
          });
        })
        .catch(error => {
          console.log(error);
          reject.send(error);
        })
    );
  });
}

module.exports = { getRandomPersonnage, getRandomQuote };
