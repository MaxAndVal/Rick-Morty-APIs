const connection = require("../../dbConnexion");

async function getFriendsOfUserById() {
  const queryString = "SELECT * FROM friends WHERE user_idA=? OR user_idB=?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, (err, rows, fields) => {
      if (err) {
        console.log("Failed query for friends " + err);
        reject({ status: 500, error: err });
        return;
      }
      
    });
  });
}

module.exports = { getFriendsOfUserById };
