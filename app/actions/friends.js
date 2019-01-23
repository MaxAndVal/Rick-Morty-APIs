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
      resolve({ code: 200, message: "get friends succeded", friends: rows });
    });
  });
}
async function addFriend(id1, id2) {
  const queryString = "insert into friends values( ? , ?)";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [id1, id2], (err, rows, fields) => {
      if (err) {
        console.log("failed add a friend " + err);
        reject({ status: 500, error: err });
        return;
      }
      resolve({ code: 200, message: "add a friend succeded" });
    });
  });
}
async function deleteFriend(id1, id2) {
  const queryString =
    "DELETE FROM friends WHERE (user_id1=? AND user_id2=?) or (user_id1=? AND user_id2=?) ";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [id1, id2, id2, id1], (err, rows, fields) => {
      if (err) {
        console.log("failed to delete a friend " + err);
        reject({ status: 500, error: err });
        return;
      }
      console.log(queryString);
      resolve({ code: 200, message: "friends is delete" });
    });
  });
}

module.exports = { getFriendsOfUserById, addFriend, deleteFriend };
