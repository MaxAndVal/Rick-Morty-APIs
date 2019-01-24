const connection = require("../../dbConnexion");
const omit = require("object.omit");
const CodeHTTP = require("../constants/CodeHTTP");
const bcrypt = require("bcrypt");
const saltRounds = 6;

async function getAllUsers() {
  const queryString = "SELECT * FROM users";
  return new Promise((resolve, reject) => {
    connection.query(queryString, (err, rows, fields) => {
      if (err) {
        console.log("Failed query for users " + err);
        reject({ status: 500, error: err });
        return;
      }
      users = rows;
      users.map(user => delete user.user_password);
      resolve(users);
    });
  });
}

async function createUser(user_name, user_email, user_password) {
  return new Promise(async (resolve, reject) => {
    selectUserByEmail(user_email)
      .then(rows => {
        console.log("test");
        if (rows.length == 0) {
          var hash = bcrypt.hashSync(user_password, saltRounds);
          insertNewUser(user_name, user_email, hash)
            .then(
              selectUserByEmail(user_email)
                .then(rows =>
                  resolve({
                    code: 200,
                    message: "user is created",
                    user: rows[0]
                  }).catch(err => reject({ code: 501, msg: "create user failed", err }))
                )
                .catch(err => reject({ code: 502, msg: "create user failed", err }))
            )
            .catch(err => reject({ code: 503, msg: "create user failed", err }));
        } else {
          reject({ code: 204, message: "Email is already used" });
        }
      })
      .catch(err => reject({ code: 501, msg: "create user failed before insert", err }));
  });
}

async function selectUserByEmail(user_email) {
  return new Promise((resolve, reject) => {
    console.log("user email : ", user_email);
    const queryString = "SELECT * FROM users WHERE user_email=?";
    connection.query(queryString, [user_email], (err, rows, fiels) => {
      if (err) {
        console.log("error in selectUserByEmail :", err);
        reject(err);
      }
      user = rows;
      console.log(user);
      return resolve(user);
    });
  });
}

function insertNewUser(user_name, user_email, user_password, external_id) {
  return new Promise((resolve, reject) => {
    const queryString =
      "INSERT INTO users (user_name, user_email, user_password, deckToOpen, external_id) VALUES (?,?,?,1,?)";
    console.log(queryString);
    connection.query(
      queryString,
      [user_name, user_email, user_password, external_id],
      (err, result, fields) => {
        if (err) {
          console.log("failed insert " + err);
          reject({ code: 502, message: "fail insert", error: err });
          return;
        } else {
          resolve({ code: 200, message: "user is created" });
        }
      }
    );
  });
}

function getUserById(id) {
  const queryString = "SELECT * FROM users WHERE user_id=?";
  return new Promise((resolve, reject) =>
    connection.query(queryString, [id], (err, rows, fiels) => {
      if (err) {
        console.log("Failed  " + err);
        reject({ code: 500, message: err });
        return;
      }
      const user = rows[0];
      delete user.user_password;
      resolve(user);
    })
  );
}

function deleteUserById(user_id) {
  const queryString = "DELETE FROM users WHERE user_id=?";
  return new Promise((resolve, reject) =>
    connection.query(queryString, [user_id], (err, rows, fields) => {
      if (err) {
        console.log("failed to delete user with id " + user_id + "error : " + err);
        reject({ code: 500, failed: err });
      } else {
        if (rows.affectedRows == 0) {
          resolve({ code: 250, message: "user not found" });
        } else {
          resolve({ code: 200, message: "user is deleted" });
        }
      }
    })
  );
}

module.exports = {
  selectUserByEmail,
  getAllUsers,
  getUserById,
  insertNewUser,
  createUser,
  deleteUserById
};
