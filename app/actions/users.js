const connection = require("../../dbConnexion");
const omit = require("object.omit");
const bcrypt = require("bcrypt");
const saltRounds = 6;
const { welcomeMail } = require("../utils/mailUtils.js");

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
                  }).catch(err =>
                    reject({ code: 501, msg: "create user failed", err })
                  )
                )
                .catch(err =>
                  reject({ code: 502, msg: "create user failed", err })
                )
            )
            .catch(err =>
              reject({ code: 503, msg: "create user failed", err })
            );
        } else {
          reject({ code: 204, message: "Email is already used" });
        }
      })
      .catch(err =>
        reject({ code: 501, msg: "create user failed before insert", err })
      );
  });
}

async function selectUserByEmail(user_email) {
  return new Promise((resolve, reject) => {
    console.log("user email : ", user_email);
    const queryString =
      "SELECT * FROM users WHERE user_email=? AND external_id IS NULL";
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
async function getDeckToOpen(user_id) {
  return new Promise((resolve, reject) => {
    const queryString = "SELECT deckToOpen FROM users where user_id=?";
    connection.query(queryString, [user_id], (err, rows, fields) => {
      if (err) {
        console.log("failed insert " + err);
        reject({ code: 502, message: "fail get dect to open", error: err });
      } else {
        resolve({
          code: 200,
          message: "user is created",
          deckToOpen: rows[0].deckToOpen
        });
      }
    });
  });
}

function insertNewUser(
  user_name,
  user_email,
  user_password,
  external_id,
  user_image
) {
  return new Promise((resolve, reject) => {
    const queryString =
      "INSERT INTO users (user_name, user_email, user_password, deckToOpen, external_id, user_image) VALUES (?,?,?,1,?,?)";
    console.log(queryString);
    connection.query(
      queryString,
      [user_name, user_email, user_password, external_id, user_image],
      (err, result, fields) => {
        if (err) {
          console.log("failed insert " + err);
          reject({ code: 502, message: "fail insert", error: err });
          return;
        } else {
          welcomeMail(user_email, user_name);
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
        reject({ code: 500, message: err.errorno });
        return;
      }
      if (rows && rows.length > 0) {
        const user = rows[0];
        delete user.user_password;
        resolve({ code: 200, message: "success", user: user });
      } else {
        resolve({ code: 250, message: "user not found", user: [] });
      }
    })
  );
}

function setGameDate(id, newDate) {
  const queryString = "UPDATE users SET user_last_game = ? WHERE user_id = ?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [newDate, id], (err, result, fields) => {
      if (err) {
        console.log("error newDate", err);
        reject({ code: 507, message: `bad request: ${err}` });
      }
      console.log("fields = ", result.affectedRows);
      if (result.affectedRows === 1) {
        resolve({ code: 200, message: "success" });
      } else {
        resolve({ code: 207, message: "user not found" });
      }
    });
  });
}

function setMemoryDate(id, newDate) {
  const queryString = "UPDATE users SET user_last_memory = ? WHERE user_id = ?";
  return new Promise((resolve, reject) => {
    connection.query(queryString, [newDate, id], (err, result, fields) => {
      if (err) {
        console.log("error newDate", err);
        reject({ code: 507, message: `bad request: ${err}` });
      }
      console.log("fields = ", result.affectedRows);
      if (result.affectedRows === 1) {
        resolve({ code: 200, message: "success" });
      } else {
        resolve({ code: 207, message: "user not found" });
      }
    });
  });
}

function deleteUserById(user_id) {
  const queryString = "DELETE FROM users WHERE user_id=?";
  return new Promise((resolve, reject) =>
    connection.query(queryString, [user_id], (err, rows, fields) => {
      if (err) {
        console.log(
          "failed to delete user with id " + user_id + "error : " + err
        );
        reject({ code: 500, message: err.errorno });
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
  getDeckToOpen,
  getAllUsers,
  getUserById,
  insertNewUser,
  createUser,
  deleteUserById,
  setGameDate,
  setMemoryDate
};
