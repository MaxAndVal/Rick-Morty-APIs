const express = require("express");
const kaamelottRoute = express.Router();
const axios = require("axios");
const connection = require("../../dbConnexion");
const { getRandomQuote } = require("../actions/kaamelott");

kaamelottRoute.get("/randomQuote", async (req, res) => {
  getRandomQuote()
    .then(response => {
      res.send(response);
    })
    .catch(error => {
      res.send(error);
    });
});

module.exports = kaamelottRoute;
