const connection = require("../../dbConnexion");
const axios = require("axios");
const { getUserById } = require("../actions/users");

async function addCardToDeck(user_id, card_id, card_name) {
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
        connection.query(queryString, [amount, user_id, card_id], (err, rows, fiels) => {
          if (err) {
            console.log("Failed if  " + err);
            reject(err.errorno);
          }
          resolve("ok");
        });
      } else {
        const card_image = `https://rickandmortyapi.com/api/character/avatar/${card_id}.jpeg`;
        queryString =
          "INSERT INTO deck (user_id, card_id, card_name,card_image, amount) VALUES(?,?,?,?,1)";
        connection.query(
          queryString,
          [user_id, card_id, card_name, card_image],
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

async function checkDeckToOpen(id) {
  return new Promise((resolve, reject) => {
    querySelect = "SELECT deckToOpen FROM users WHERE user_id=?";
    connection.query(querySelect, [id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject({ code: 500, message: err.errorno });
      }
      if (rows.length < 1) {
        return reject({ code: 400, message: "user not found" });
      }
      var deckToOpen = rows[0].deckToOpen;
      if (deckToOpen <= 0) {
        resolve({ code: 205, message: "No deck to open" });
      } else {
        resolve(openTheDeck(id));
      }
    });
  });
}

async function cardsById(id) {
  return new Promise((resolve, reject) => {
    axios
      .get("https://rickandmortyapi.com/api/character/" + id)
      .then(response => resolve(response))
      .catch(error => {
        console.log("erreur", error);
        reject({
          code: 502,
          message: error.response.data.error
        });
      });
  });
}
async function getCardsById(id) {
  return new Promise((resolve, reject) => {
    axios
      .get("https://rickandmortyapi.com/api/character/" + id)
      .then(response => {
        const result = response.data;
        resolve({
          code: 200,
          message: "success",
          id: result.id,
          name: result.name,
          status: result.status,
          species: result.species,
          gender: result.gender,
          origin: result.origin.name,
          location: result.location.name,
          image: result.image
        });
      })
      .catch(error => {
        console.log("erreur", error);
        reject({
          code: 502,
          message: error.response.data.error
        });
      });
  });
}

async function getDeckById(user_id) {
  return new Promise((resolve, reject) => {
    query = "SELECT * FROM deck WHERE user_id=? AND amount>0";
    connection.query(query, [user_id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject({ code: 500, message: err.errorno });
      }
      resolve({ code: 200, message: "getDeck is succefull", deck: rows });
    });
  });
}
async function decreaseDeckToOpen(id) {
  return new Promise((resolve, reject) => {
    querySelect = "SELECT deckToOpen FROM users WHERE user_id=?";
    connection.query(querySelect, [id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject({ code: 500, message: err.errorno });
      }
      var deckToOpen = rows[0].deckToOpen;
      if (deckToOpen > 0) {
        deckToOpen = deckToOpen - 1;
        queryDecrease = "UPDATE users SET deckToOpen=? WHERE user_id=?";
        connection.query(queryDecrease, [deckToOpen, id], (err, rows, fields) => {
          if (err) {
            console.log("Failed  " + err);
            return reject({ code: 500, message: err.errorno });
          }
        });
        resolve("ok");
      } else {
        reject({ code: 300, message: "No deck to open" });
      }
    });
  });
}

async function getCardsByPages(page) {
  return new Promise((resolve, reject) => {
    axios
      .get("https://rickandmortyapi.com/api/character/?page=" + page)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log("erreur", error);
        reject(error);
      });
  });
}
async function getCardByName(name) {
  return new Promise((resolve, reject) => {
    axios
      .get("https://rickandmortyapi.com/api/character/?name=" + name)
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
  });
}

async function openTheDeck(user_id) {
  return new Promise(async (resolve, reject) => {
    try {
      var newDeck = [];
      for (i = 0; i < 10; i++) {
        var card = await cardsById(Math.floor(Math.random() * 493));
        await addCardToDeck(user_id, card.data.id, card.data.name);
        newDeck.push({ card_id: card.data.id });
      }
      await decreaseDeckToOpen(user_id);
      resolve({ code: 200, message: "deck is opened", deck: newDeck });
    } catch (e) {
      reject(e);
    }
  });
}

async function addRewardsToUser(listOfCards, user_id) {
  return new Promise(async (resolve, reject) => {
    try {
      for (i = 0; i < listOfCards.length; i++) {
        const card = listOfCards[i];
        await addCardToDeck(user_id, card.card_id, card.card_name);
      }
      resolve({ code: 200, message: "rewards added !" });
    } catch (e) {
      reject(e);
    }
  });
}

async function addDeckToOpen(user_id, deckNumber) {
  //TODO : add user in return value
  return new Promise(async (resolve, reject) => {
    let queryIncrease = "UPDATE users SET deckToOpen = ? WHERE user_id = ?";
    connection.query(queryIncrease, [deckNumber, user_id], (err, result, fields) => {
      if (err) {
        console.log("error insert newDeck", err);
        reject({ code: 510, message: `bad request: ${err}` });
      }
      if (result.affectedRows === 1) {
        resolve(getUserById(user_id));
      } else {
        resolve({ code: 207, message: "user not found" });
      }
    });
  });
}

async function selectCardsForDeck(amount) {
  return new Promise(async (resolve, reject) => {
    try {
      var newDeck = [];
      for (i = 0; i < amount; i++) {
        var card = await cardsById(Math.floor(Math.random() * 493));
        newDeck.push({
          card_id: card.data.id,
          card_name: card.data.name,
          card_image: card.data.image
        });
      }
      resolve({ code: 200, message: "selection is ok", deck: newDeck });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  decreaseDeckToOpen,
  getCardByName,
  addCardToDeck,
  openTheDeck,
  getDeckById,
  getCardsById,
  checkDeckToOpen,
  getCardsByPages,
  addDeckToOpen,
  selectCardsForDeck,
  addRewardsToUser
};
