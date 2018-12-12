const connection = require("../../dbConnexion");

async function addCardToDeck(user_id, card_id) {
  return new Promise((resolve, reject) => {
    querySelect = "SELECT amount FROM deck WHERE user_id=? AND card_id=?";
    connection.query(querySelect, [user_id, card_id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject(err);
      }
      if (rows.length > 0) {
        addCardToDeck;
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
        resolve({ code: 200, message: "opening deck" });
      }
    });
  });
}

async function randomCard(randomNumber) {
  return axios
    .get("https://rickandmortyapi.com/api/character/" + randomNumber)
    .catch(error => {
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
    decreaseDeckToOdecreaseDeckToOpenpen;
  });
}

module.exports = {
  decreaseDeckToOpen,
  addCardToDeck,
  getDeckById,
  randomCard,
  checkDeckToOpen
};
