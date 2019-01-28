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
  const queryString = "insert into friends values( ? , ?, false)";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [id1, id2], (err, rows, fields) => {
      if (err) {
        console.log("failed to accepte a friend request" + err);
        reject({ status: 500, error: err });
        return;
      } else {
        resolve({ code: 200, message: "add a friend request succeded" });
      }
    });
  });
}

async function acceptedFriendship(id1, id2) {
  const queryString =
    "UPDATE friends set accepted=true WHERE (user_idA=? AND user_idB=?) or (user_idA=? AND user_idB=?)";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [id1, id2, id2, id1], (err, rows, fields) => {
      if (err) {
        console.log("failed add a friend request" + err);
        reject({ status: 500, error: err });
        return;
      }
      resolve({ code: 200, message: "add a friend request succeded" });
    });
  });
}

async function deleteFriend(id1, id2) {
  const queryString =
    "DELETE FROM friends WHERE (user_idA=? AND user_idB=?) or (user_idA=? AND user_idB=?) ";
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

async function searchForFriends(user) {
  const queryString =
    "SELECT user_name, user_id FROM users WHERE user_name like (?) OR user_email=? or user_id=?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [`%${user}%`, user, user], (err, rows, fields) => {
      if (err) {
        console.log("failed to search for friend " + err);
        reject({ status: 500, error: err });
        return;
      }
      resolve({ code: 200, message: "sucess", friends: rows });
    });
  });
}

module.exports = {
  acceptedFriendship,
  getFriendsOfUserById,
  addFriend,
  deleteFriend,
  searchForFriends
};
