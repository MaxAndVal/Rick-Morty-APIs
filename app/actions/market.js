const connection = require("../../dbConnexion");
const axios = require("axios");
const { addCardToDeck } = require("./cards");

async function getMarketOfUser(user_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM market WHERE user_id=?";
    connection.query(query, [user_id], (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject(err);
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
          reject(err);
        }
        resolve({ code: 200, message: "add card succeded" });
      }
    );
  });
};
const buyCard = async (user_id, friend_id, card_id, price) => {
  return new Promise(async (resolve, reject) => {
    connection.beginTransaction(function(err) {
      if (err) {
        reject(err);
      }
      let queryAmountU2 = "SELECT amount, card_name FROM deck WHERE card_id=? AND user_id=?";
      connection.query(queryAmountU2, [card_id, friend_id], (err, rows, fields) => {
        if (err) {
          connection.rollback(function() {
            reject(err);
          });
          reject(err);
        }
        if (rows === undefined) {
          connection.rollback(function() {
            reject(err);
          });
          return reject("undifined");
        }
        const actualAmount = rows[0].amount;
        const card_name = rows[0].card_name;

        if (actualAmount > 0) {
          queryAmountU2 = "UPDATE deck SET amount = ? WHERE card_id =? and user_id=?";
          connection.query(
            queryAmountU2,
            [actualAmount - 1, card_id, friend_id],
            (err, rows, fields) => {
              if (err) {
                connection.rollback(function() {
                  reject(err);
                });
                reject(err);
              }
              addCardToDeck(user_id, card_id, card_name).then(res => {
                const result = res;
                if (result != "ok") {
                  connection.rollback(function() {
                    reject(err);
                  });
                  reject(err);
                }
              });
              connection.query(
                "UPDATE users SET user_wallet=user_wallet+? where user_id=?",
                [price, friend_id],
                (err, rows, fields) => {
                  if (err) {
                    connection.rollback(function() {
                      reject(err);
                    });
                    reject(err);
                  }
                }
              );
              connection.query(
                "UPDATE users SET user_wallet=user_wallet-? where user_id=?",
                [price, user_id],
                (err, rows, fields) => {
                  if (err) {
                    connection.rollback(function() {
                      reject(err);
                    });
                    reject(err);
                  }
                }
              );
              connection.query(
                "DELETE from market where user_id=? AND card_id=? AND price=? LIMIT 1",
                [friend_id, card_id, price],
                (err, rows, fields) => {
                  if (err) {
                    connection.rollback(function() {
                      reject(err);
                    });
                    reject(err);
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
            }
          );
        } else {
          reject({ code: 400, message: "erreur amount < 0" });
        }
      });
    });
  });
};

module.exports = { getMarketOfUser, addCardtoMarket, buyCard };
