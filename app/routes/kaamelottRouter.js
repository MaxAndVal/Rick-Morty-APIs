const express = require("express");
const kaamelottRoute = express.Router();
const axios = require("axios");
const connection = require("../../dbConnexion");

kaamelottRoute.get("/getRandomQuote", (req, res) => {
  axios
    .get("https://kaamelott.chaudie.re/api/random")
    .then(response => {
      res.json(response.data.citation.citation);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = kaamelottRoute;
