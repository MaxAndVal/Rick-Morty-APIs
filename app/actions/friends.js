const connection = require("../../dbConnexion");

async function getFriendsOfUserById(id) {
  const queryString =
    "SELECT distinct * FROM friends FR inner JOIN users US on FR.user_idA=US.user_id or FR.user_idB = US.user_id WHERE (((FR.user_idA=? OR FR.user_idB=?) AND FR.accepted=true) OR ((FR.user_idB=?) AND FR.accepted=false)) AND not US.user_id=?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [id, id, id, id], (err, rows, fields) => {
      if (err) {
        console.log("Failed query for friends " + err);
        reject({ status: 500, error: err });
        return;
      }
      // parsing int into bool
      for (var i = 0; i < rows.length; i++) {
        rows[i].accepted = !!rows[i].accepted;
      }
      users = rows;
      users.map(user => delete user.user_password);
      resolve({ code: 200, message: "get friends succeded", friends: users });
    });
  });
}
async function addFriend(user, id2) {
  const queryString = "insert into friends values( ? , ?, false)";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [user, id2], (err, rows, fields) => {
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

async function acceptedFriendship(user, id2) {
  const queryString =
    "UPDATE friends set accepted = true WHERE (user_idA=? AND user_idB=?) or (user_idA=? AND user_idB=?)";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [user, id2, id2, user], (err, rows, fields) => {
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
      resolve({ code: 200, message: "friends is delete" });
    });
  });
}

async function searchForFriends(user, request) {
  const queryString =
    "SELECT user_name, user_id FROM users WHERE (user_name like (?) OR (user_email=? OR user_id=?)) AND user_id != ?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [`%${request}%`, request, request, user], (err, rows, fields) => {
      if (err) {
        console.log("failed to search for friend " + err);
        reject({ status: 500, error: err });
        return;
      }
      resolve({ code: 200, message: "success", friends: rows });
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
