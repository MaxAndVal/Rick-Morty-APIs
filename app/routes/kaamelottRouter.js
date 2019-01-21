const express = require("express");
const kaamelottRoute = express.Router();
const axios = require("axios");
const connection = require("../../dbConnexion");

kaamelottRoute.get("/randomQuote", async (req, res) => {
  axios
    .get("https://kaamelott.chaudie.re/api/random")
    .then(response => {
      res.send({
        citation: response.data.citation.citation,
        personnage: response.data.citation.infos.personnage
      });
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
});

module.exports = kaamelottRoute;
