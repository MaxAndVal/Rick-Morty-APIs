const connection = require("../../dbConnexion");
const axios = require("axios");

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

module.exports = { getMarketOfUser, addCardtoMarket };
