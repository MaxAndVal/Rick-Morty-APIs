const connection = require("../../dbConnexion");
const bcrypt = require("bcrypt");
const saltRounds = 6;
const { insertNewUser } = require("./users");
const { lostPasswordMail } = require("../utils/mailUtils");
const { randomCode } = require("../utils/codeUtil");
const moment = require("moment");

async function login(user_email, user_password, user_name, external_id, user_image) {
  return new Promise(async (resolve, reject) => {
    if (external_id) {
      selectUserByExternalId(external_id, user_name, user_email, user_image)
        .then(rows =>
          resolve({
            code: 200,
            message: "login successfull external",
            user: rows[0]
          })
        )
        .catch(err => reject({ code: 500, message: err }));
    } else {
      console.log("MAIL : ", user_email);
      selectUserByEmailPwd(user_email)
        .then(rows => {
          console.log("rows :", rows);
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
        .catch(err => reject({ code: 508, message: "User doesn't exist", err }));
    }
  });
}
async function selectUserByExternalId(external_id, user_name, user_email, user_image) {
  console.log("userImage in SelectByExt : ", user_image);
  return new Promise((resolve, reject) => {
    const queryString = "SELECT * FROM users where external_id=?";
    connection.query(queryString, [external_id], (err, rows, fields) => {
      if (err || !rows) {
        reject(err || "unknown error");
      }
      if (rows.length > 0) {
        resolve(rows);
      } else {
        var hash = bcrypt.hashSync(external_id, saltRounds);
        insertNewUser(user_name, user_email, hash, external_id, user_image)
          .then(() =>
            selectUserByExternalId(external_id)
              .then(rows =>
                resolve(rows).catch(err => reject({ code: 501, msg: "create user failed", err }))
              )
              .catch(err => reject({ code: 502, msg: "create user failed", err }))
          )
          .catch(err => reject({ code: 503, msg: "create user failed", err }));
      }
    });
  });
}
// Same function as USERS but this one return PWD for checking
// Avoiding to use 'omit' each time we are using the other function selectUserByEmail
async function selectUserByEmailPwd(user_email) {
  console.log("user_mail ", user_email);
  return new Promise((resolve, reject) => {
    const queryString = "SELECT * FROM users WHERE user_email=? AND external_id IS NULL";
    connection.query(queryString, [user_email], (err, rows, fields) => {
      if (err) {
        reject(err);
      }
      console.log("rows : ", rows);
      resolve(rows);
    });
  });
}
async function addCodeInDB(user_id, code) {
  return new Promise((resolve, reject) => {
    console.log("addCodeInDB");
    const date = moment().format("YYYY-MM-DD");
    console.log("date :", date);
    const queryString = `INSERT INTO lost_password (user_id, code_password, date) VALUES (?,?,?) ON DUPLICATE KEY UPDATE code_password = ?, date = ?`;
    connection.query(queryString, [user_id, code, date, code, date], (err, rows, fields) => {
      if (err) {
        console.log("error : ", err);
        reject(err);
      }
      resolve("Ok");
    });
  });
}

async function lostPassword(user_email) {
  return new Promise((resolve, reject) => {
    const queryString = "SELECT * FROM users WHERE user_email=? AND external_id IS NULL";
    const code = randomCode();
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

async function changePassword(user_id, user_email, user_old_password, user_new_password) {
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

async function resetPassword(user_email, user_ord_password, user_new_password) {
  return new Promise((resolve, reject) => {});
}

module.exports = {
  login,
  changePassword,
  lostPassword
};
