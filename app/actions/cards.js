const connection = require("../../dbConnexion");
const axios = require("axios");

async function addCardToDeck(user_id, card) {
  return new Promise((resolve, reject) => {
    querySelect = "SELECT amount FROM deck WHERE user_id=? AND card_id=?";
    connection.query(querySelect, [user_id, card.id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject(err);
      }
      if (rows.length > 0) {
        addCardToDeck;
        const amount = rows[0].amount + 1;
        queryString = "UPDATE deck SET amount=? WHERE user_id=? AND card_id=?";
        connection.query(queryString, [amount, user_id, card.id], (err, rows, fiels) => {
          if (err) {
            console.log("Failed if  " + err);
            reject(err);
          }
          resolve("ok");
        });
      } else {
        queryString =
          "INSERT INTO deck (user_id, card_id, card_name,card_image, amount) VALUES(?,?,?,?,1)";
        connection.query(
          queryString,
          [user_id, card.id, card.name, card.image],
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
        return reject(err);
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

async function getCardsById(id) {
  return axios.get("https://rickandmortyapi.com/api/character/" + id).catch(error => {
    error;
  });
}

async function getDeckById(user_id) {
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
        connection.query(queryDecrease, [deckToOpen, id], (err, rows, fields) => {
          if (err) {
            console.log("Failed  " + err);
            return reject(err);
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
        var card = await getCardsById(Math.floor(Math.random() * 493));
        await addCardToDeck(user_id, card.data);
        newDeck.push(card.data);
      }
      await decreaseDeckToOpen(user_id);
      resolve(newDeck);
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
  getCardsByPages
};
