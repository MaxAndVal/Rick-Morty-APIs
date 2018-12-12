const express = require("express");
const cardsRoute = express.Router();
const axios = require("axios");
const {
  getDeckById,
  checkDeckToOpen,
  getCardsById,
  decreaseDeckToOpen,
  addCardToDeck
} = require("../actions/cards");

cardsRoute.get("/:id", (req, res) => {
  getCardsById(req.params.id)
    .then(response => {
      res.json(response.data);
    })
    .catch();
});

cardsRoute.get("/all/:page", (req, res) => {
  const page = req.params.page > 1 ? req.params.page : 1;
  axios
    .get("https://rickandmortyapi.com/api/character/?page=" + page)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log(error);
      res.jon(error);
    });
});

cardsRoute.get("/randomDeckGenerator/:id", async (req, res) => {
  const user_id = req.params.id;
  checkDeckToOpen(user_id)
    .then(async () => {
      try {
        var newDeck = [];
        for (i = 0; i < 10; i++) {
          var card = await getCardsById(Math.floor(Math.random() * 493));
          await addCardToDeck(user_id, card.data);
          newDeck.push(card.data);
        }
        await decreaseDeckToOpen(user_id);
        res.json(newDeck);
      } catch (e) {
        console.log("e.stack: ", e);
        res.send(e);
      }
      res.end();
    })
    .catch();
});

module.exports = cardsRoute;
