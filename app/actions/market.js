const connection = require("../../dbConnexion");
const axios = require("axios");
const { addCardToDeck } = require("./cards");

async function getMarketOfUser(user_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM market WHERE user_id=?";
    connection.query(query, [user_id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject({ code: 500, message: err.errorno });
      }
      resolve({ code: 200, message: "getMarketById is succefull", deck: rows });
    });
  });
}

const addCardtoMarket = async (user_id, card_id, card_name, price) => {
  return new Promise((resolve, reject) => {
    const card_image = `https://rickandmortyapi.com/api/character/avatar/${card_id}.jpeg`;
    const queryString =
      "INSERT INTO market (user_id, card_id, card_name, card_image, price) VALUES(?,?,?,?,?)";
    connection.query(
      queryString,
      [user_id, card_id, card_name, card_image, price],
      (err, rows, fiels) => {
        if (err) {
          console.log("Failed else " + err);
          reject({ code: 500, message: err.errorno });
        }
        const updateDeck = "UPDATE deck SET amount=amount-1 WHERE user_id=? AND card_id=?";
        connection.query(updateDeck, [user_id, card_id], (err, fields, row) => {
          if (err) {
            console.log(err);
          } else {
            console.log("decrease card");
          }
        });
        resolve({ code: 200, message: "add card succeded" });
      }
    );
  });
};
const buyCard = async (user_id, friend_id, card_id, price) => {
  return new Promise(async (resolve, reject) => {
    connection.beginTransaction(function(err) {
      if (err) {
        reject({ code: 500, message: err.errorno });
      }
      addCardToDeck(user_id, card_id, card_name).then(res => {
        const result = res;
        if (result != "ok") {
          connection.rollback(function() {
            reject({ code: 500, message: err.errorno });
          });
          reject({ code: 500, message: err.errorno });
        }
      });
      connection.query(
        "UPDATE users SET user_wallet=user_wallet+? where user_id=?",
        [price, friend_id],
        (err, rows, fields) => {
          if (err) {
            connection.rollback(function() {
              reject({ code: 500, message: err.errorno });
            });
            reject({ code: 500, message: err.errorno });
          }
        }
      );
      connection.query(
        "UPDATE users SET user_wallet=user_wallet-? where user_id=?",
        [price, user_id],
        (err, rows, fields) => {
          if (err) {
            connection.rollback(function() {
              reject({ code: 500, message: err.errorno });
            });
            reject({ code: 500, message: err.errorno });
          }
        }
      );
      connection.query(
        "DELETE from market where user_id=? AND card_id=? AND price=? LIMIT 1",
        [friend_id, card_id, price],
        (err, rows, fields) => {
          if (err) {
            connection.rollback(function() {
              reject({ code: 500, message: err.errorno });
            });
            reject({ code: 500, message: err.errorno });
          }
        }
      );
      connection.commit(function(err) {
        if (err) {
          connection.rollback(function() {
            throw err;
          });
        }
        resolve({ code: 200, message: "F*** i hope it's okay" });
      });
    });
  });
};

module.exports = { getMarketOfUser, addCardtoMarket, buyCard };
