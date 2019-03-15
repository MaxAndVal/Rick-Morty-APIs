const connection = require("../../dbConnexion");
const bcrypt = require("bcrypt");
const saltRounds = 6;
const { insertNewUser } = require("./users");
const { lostPasswordMail } = require("../utils/mailUtils");
const { randomCode } = require("../utils/codeUtil");
const moment = require("moment");

async function login(
  user_email,
  user_password,
  user_name,
  external_id,
  user_image,
  session_token
) {
  console.log("login : token = " + token);
  return new Promise(async (resolve, reject) => {
    if (external_id) {
      selectUserByExternalId(external_id, user_name, user_email, user_image)
        .then(rows =>
          resolve({
            code: 200,
            message: "login successfull external",
            user: rows
          })
        )
        .catch(err => reject({ code: 500, message: err }));
    } else if (session_token) {
      console.log("login2 : token = " + session_token);
      selectUserBySessionToken(session_token)
        .then(rows => {
          if (rows.length > 0) {
            resolve({
              code: 200,
              message: "login by token successfull",
              user: rows[0]
            });
          } else {
            reject({
              code: 204,
              message: "Token expired"
            });
          }
        })
        .catch(err =>
          reject({
            code: 500,
            message: err
          })
        );
    } else {
      console.log("MAIL : ", user_email);
      selectUserByEmailPwd(user_email)
        .then(rows => {
          if (rows.length > 0) {
            if (bcrypt.compareSync(user_password, rows[0].user_password)) {
              resolve({
                code: 200,
                message: "login sucessfull",
                user: rows[0]
              });
            } else {
              reject({
                code: 204,
                message: "Email and password does not match, try again, sorry"
              });
            }
          } else {
            reject({ code: 204, message: "Email does not exist" });
          }
        })
        .catch(err =>
          reject({ code: 508, message: "User doesn't exist", err })
        );
    }
  });
}

async function selectUserBySessionToken(token) {
  console.log("selectUserBySessionToken : token = " + token);
  return new Promise((resolve, reject) => {
    const queryString = "SELECT * FROM users WHERE session_token=?";
    connection.query(queryString, [token], (err, rows, fields) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

async function selectUserByExternalId(
  external_id,
  user_name,
  user_email,
  user_image
) {
  return new Promise((resolve, reject) => {
    const queryString = "SELECT * FROM users where external_id=?";
    connection.query(queryString, [external_id], (err, rows, fields) => {
      if (err || !rows) {
        reject(err || "unknown error");
      }
      if (rows.length > 0) {
        const token = randomCode(30);
        console.log("random : token = " + token);
        const queryToken = "UPDATE users set session_token = ? WHERE user_id=?";
        connection.query(
          queryToken,
          [token, rows[0].user_id],
          (err, rows, fields) => {
            if (err) {
              console.log("err ", err);
            }
          }
        );
        user = rows[0];
        user["session_token"] = token;
        resolve(user);
      } else {
        var hash = bcrypt.hashSync(external_id, saltRounds);
        insertNewUser(user_name, user_email, hash, external_id, user_image)
          .then(() =>
            selectUserByExternalId(external_id)
              .then(rows =>
                resolve(rows).catch(err =>
                  reject({ code: 501, msg: "create user failed", err })
                )
              )
              .catch(err =>
                reject({ code: 502, msg: "create user failed", err })
              )
          )
          .catch(err => reject({ code: 503, msg: "create user failed", err }));
      }
    });
  });
}
// Same function as USERS but this one return PWD for checking
// Avoiding to use 'omit' each time we are using the other function selectUserByEmail
async function selectUserByEmailPwd(user_email) {
  return new Promise((resolve, reject) => {
    const queryString =
      "SELECT * FROM users WHERE user_email=? AND external_id IS NULL";
    connection.query(queryString, [user_email], (err, rows, fields) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
async function addCodeInDB(user_id, code) {
  return new Promise((resolve, reject) => {
    const date = moment().format("YYYY-MM-DD");
    const queryString = `INSERT INTO lost_password (user_id, code_password, date) VALUES (?,?,?) ON DUPLICATE KEY UPDATE code_password = ?, date = ?`;
    connection.query(
      queryString,
      [user_id, code, date, code, date],
      (err, rows, fields) => {
        if (err) {
          console.log("error : ", err);
          reject(err);
        }
        resolve("Ok");
      }
    );
  });
}

async function lostPassword(user_email) {
  return new Promise((resolve, reject) => {
    const queryString =
      "SELECT * FROM users WHERE user_email=? AND external_id IS NULL";
    const code = randomCode(5);
    connection.query(queryString, [user_email], (err, rows, fields) => {
      if (err) {
        console.log("err ", err);
        reject(err);
      }
      if (rows && rows.length > 0) {
        addCodeInDB(rows[0].user_id, code)
          .then(lostPasswordMail(user_email, code))
          .catch(err => console.log(err));
      }
      resolve({ code: 200, message: "email sent" });
    });
  });
}

async function changePassword(
  user_id,
  user_email,
  user_old_password,
  user_new_password
) {
  return new Promise((resolve, reject) => {
    selectUserByEmailPwd(user_email).then(rows => {
      if (rows.length > 0) {
        if (bcrypt.compareSync(user_old_password, rows[0].user_password)) {
          var hash = bcrypt.hashSync(user_new_password, saltRounds);
          const query =
            "UPDATE users set user_password = ? WHERE user_email=? AND external_id IS NULL";
          connection.query(query, [hash, user_email], (err, rows, fields) => {
            if (err) {
              console.log("err ", err);
              reject(err);
            }
            resolve({
              code: 200,
              message: "password is changed sucessfully",
              user: rows[0]
            });
          });
        } else {
          reject({
            code: 204,
            message: "Password is incorrect, try again, sorry"
          });
        }
      } else {
        reject({
          code: 204,
          message: ", try again, sorry"
        });
      }
    });
  });
}

const loginWithCode = async user_code => {
  const query = `select * from users INNER JOIN lost_password ON users.user_id = lost_password.user_id where code_password=?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [user_code], (err, rows, field) => {
      if (err) {
        console.log(err);
        reject({ code: 500, message: err.errorno });
      }
      if (rows && rows[0]) {
        user = rows[0];
        delete user.user_password;
        delete user.code_password;
        const actualDate = moment().format("YYYY-MM-DD");
        if (moment(actualDate).diff(user.date, "days") === 0) {
          delete user.date;
          resolve({ code: 200, message: "Success", user: user });
        } else {
          resolve({ code: 205, message: "Code is expired" });
        }
        const queryDel = "DELETE from lost_password where code=?";
        connection.query(queryDel, [user_code], (err, rows, field) => {
          if (err) {
            console.log(err);
          }
        });
      } else {
        resolve({ code: 204, message: "Code incorrect" });
      }
    });
  });
};

module.exports = {
  login,
  changePassword,
  lostPassword,
  loginWithCode
};
