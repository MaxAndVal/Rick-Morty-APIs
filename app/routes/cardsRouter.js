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
  getCardByName,
  addDeckToOpen,
  selectCardsForDeck,
  addRewardsToUser
} = require("../actions/cards");

cardsRoute.get("/search/:name", (req, res) => {
  getCardByName(req.params.name).then(response => {
    res.json([response.data]).catch(error => res.send([error]));
  });
});

cardsRoute.get("/:id", (req, res) => {
  getCardsById(req.params.id)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.json(error));
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

cardsRoute.get("/randomDeckGenerator/", async (req, res) => {
  const user_id = req.user;
  console.log(user_id);
  checkDeckToOpen(user_id)
    .then(response => res.json(response))
    .catch(error => {
      res.json([error]);
    });
});

cardsRoute.get("/randomSelectionFor/:amount", async (req, res) => {
  const amount = req.params.amount;
  selectCardsForDeck(amount)
    .then(response => res.json(response))
    .catch(error => {
      res.json(error);
    });
});

cardsRoute.post("/addDecks", async (req, res) => {
  addDeckToOpen(req.body.user_id, req.body.deckNumber)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

cardsRoute.post("/addRewards", async (req, res) => {
  addRewardsToUser(req.body.listOfCards, req.body.user_id)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

module.exports = cardsRoute;
