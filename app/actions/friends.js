const connection = require("../../dbConnexion");

async function getFriendsOfUserById(id) {
  const queryString =
    "SELECT distinct US.user_id, US.user_name FROM friends FR, users US WHERE (FR.user_idA=? OR FR.user_idB=?) AND (US.user_id=FR.user_idA OR US.user_id=FR.user_idB) AND not US.user_id=?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [id, id, id], (err, rows, fields) => {
      if (err) {
        console.log("Failed query for friends " + err);
        reject({ status: 500, error: err });
        return;
      }
      resolve({ code: 200, success: "get friends succeded", friends: rows });
    });
  });
}

module.exports = { getFriendsOfUserById };
