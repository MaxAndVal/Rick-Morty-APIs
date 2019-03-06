const connection = require("../../dbConnexion");
const axios = require("axios");
const {addCardToDeck} = require("./cards")

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
const buyCard = async(user_id, friend_id, card_id, price) =>{
  console.log("user_id", user_id)
  console.log("friends", friend_id)
  console.log("card",card_id)
  console.log("prix", price)
return new Promise (async (resolve, reject)=>{
      connection.beginTransaction(function(err){
        if(err){
          reject(err)
        }
        let queryAmountU2= "SELECT amount FROM deck WHERE card_id=? AND user_id=?"
        connection.query(queryAmountU2,[card_id, friend_id], (err, rows, fields)=>{
          if(err){
            connection.rollback(function() {
              reject(err);
            });
            reject(err)
          }
          if(!rows){
            reject("undifined")
          }
          console.log("rows : ", rows[0].amount)
          const actualAmount = rows[0].amount;
          if(actualAmount>0){
          queryAmountU2 = "UPDATE deck SET amount = ? WHERE card_id =? and user_id=?"
          connection.query(queryAmountU2, [actualAmount-1, card_id, friend_id], (err, rows, fields)=>{
            if(err){
              connection.rollback(function() {
                reject(err);
              });
              reject(err);
            }
            console.log(user_id, card_id)
            addCardToDeck(user_id, card_id).then(res =>
              {
                const result = res
                if(result!="ok"){
                  connection.rollback(function() {
                    reject(err);
                  });
                  reject(err);
                }
                connection.commit(function(err) {
                  if (err) { 
                    connection.rollback(function() {
                      throw err;
                    });
                  }
                  console.log('Transaction Complete.');
                  resolve(result+"tc")
                });
              }
              )
          })
          }else{
            reject({code:400, message:"erreur amount < 0"})
          }
        })
      })
  })
}

module.exports = { getMarketOfUser, addCardtoMarket ,buyCard};
