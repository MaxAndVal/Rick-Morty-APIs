const express = require("express");
const cardsRoute = express.Router();
const axios = require("axios");
const connection = require("../../dbConnexion");
const { omit } = require("lodash");

cardsRoute.get("/getAll/:page", (req, res) => {
  const page = req.params.page > 1 ? req.params.page : 1;
  axios
    .get("https://rickandmortyapi.com/api/character/?page=" + page)

    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log("error:", error);
    });
});
async function randomCard(randomNumber) {
  return axios
    .get("https://rickandmortyapi.com/api/character/" + randomNumber)
    .catch(error => {
      error;
    });
}
function getDeckById(user_id) {
  return new Promise((resolve, reject) => {
    query = "SELECT * FROM deck WHERE user_id=?";
    connection.query(query, [user_id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject(err);
      }
      resolve({ deck: rows });
    });
  });
}
async function decreaseDeckToOpen(id) {
  return new Promise((resolve, reject) => {
    querySelect = "SELECT deckToOpen FROM users WHERE user_id=?";
    connection.query(querySelect, [id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject(err);
      }
      var deckToOpen = rows[0].deckToOpen;
      if (deckToOpen > 0) {
        deckToOpen = deckToOpen - 1;
        queryDecrease = "UPDATE users SET deckToOpen=? WHERE user_id=?";
        connection.query(
          queryDecrease,
          [deckToOpen, id],
          (err, rows, fields) => {
            if (err) {
              console.log("Failed  " + err);
              return reject(err);
            }
          }
        );
        resolve("ok");
      } else {
        reject("No deck to open");
      }
    });
  });
}
function addCardToDeck(user_id, card_id) {
  return new Promise((resolve, reject) => {
    querySelect = "SELECT amount FROM deck WHERE user_id=? AND card_id=?";
    connection.query(querySelect, [user_id, card_id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject(err);
      }
      if (rows.length > 0) {
        const amount = rows[0].amount + 1;
        queryString = "UPDATE deck SET amount=? WHERE user_id=? AND card_id=?";
        connection.query(
          queryString,
          [amount, user_id, card_id],
          (err, rows, fiels) => {
            if (err) {
              console.log("Failed if  " + err);
              reject(err);
            }
            resolve("ok");
          }
        );
      } else {
        queryString =
          "INSERT INTO deck (user_id, card_id, amount) VALUES(?,?,1)";
        connection.query(
          queryString,
          [user_id, card_id],
          (err, rows, fiels) => {
            if (err) {
              console.log("Failed else " + err);
              reject(err);
            }
            resolve("ok");
          }
        );
      }
    });
  });
}
cardsRoute.get("/userDeck/:id", async (req, res) => {
  getDeckById(req.params.id)
    .then(deck => res.json(deck))
    .catch(err => res.send(err));
});

function checkDeckToOpen(id) {
  return new Promise((resolve, reject) => {
    querySelect = "SELECT deckToOpen FROM users WHERE user_id=?";
    connection.query(querySelect, [id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject(err);
      }
      var deckToOpen = rows[0].deckToOpen;
      if (deckToOpen <= 0) {
        resolve({ code: 205, message: "No deck to open" });
      } else {
        resolve({ code: 200, message: "opening deck" });
      }
    });
  });
}

cardsRoute.get("/randomDeckGenerator/:id", async (req, res) => {
  const user_id = req.params.id;
  checkDeckToOpen(user_id)
    .then(async () => {
      try {
        var newDeck = [];
        for (i = 0; i < 10; i++) {
          var card = await randomCard(Math.floor(Math.random() * 493));
          await addCardToDeck(user_id, card.data.id);
          newDeck.push(card.data);
        }
        await decreaseDeckToOpen(user_id);
        res.json(newDeck);
      } catch (e) {
        console.log("e.stack: ", e);
        res.status(500).send({ error: e });
      }
      res.end();
    })
    .catch();
});

module.exports = cardsRoute;
