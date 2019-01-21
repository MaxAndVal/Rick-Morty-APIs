const express = require("express");
const cardsRoute = express.Router();
const axios = require("axios");
const {
  getCardsByPages,
  checkDeckToOpen,
  getCardsById,
  openTheDeck,
  decreaseDeckToOpen,
  addCardToDeck,
  getCardByName
} = require("../actions/cards");

cardsRoute.get("/search/:name", (req, res) => {
  getCardByName(req.params.name).then(response => {
    res.json([response.data]).catch(error => res.send([error]));
  });
});

cardsRoute.get("/:id", (req, res) => {
  getCardsById(req.params.id)
    .then(response => {
      res.json([response.data]);
    })
    .catch(error => res.json([error]));
});

cardsRoute.get("/all/:page", (req, res) => {
  const page = req.params.page > 1 ? req.params.page : 1;
  getCardsByPages(page)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.json(error);
    });
});

cardsRoute.get("/randomDeckGenerator/:id", async (req, res) => {
  const user_id = req.params.id;
  checkDeckToOpen(user_id)
    .then(response => res.json([response]))
    .catch(error => {
      res.json([error]);
    });
});

module.exports = cardsRoute;
