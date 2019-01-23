const connection = require("../../dbConnexion");
const { omit } = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 6;

function login(user_email, user_password) {
  return new Promise(async (resolve, reject) => {
    selectUserByEmailPwd(user_email).then(rows => {
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
            message: "Email and password does not match, try again "
          });
        }
      } else {
        reject({ code: 204, message: "Email does not exist" });
      }
    });
  });
}
// Same function as USERS but this one return PWD for checking
// Avoiding to use 'omit' each time we are using the other function selectUserByEmail
async function selectUserByEmailPwd(user_email) {
  return new Promise((resolve, reject) => {
    const queryString =
      "SELECT user_id, user_name, user_email, user_password, deckToOpen FROM users WHERE user_email=?";
    connection.query(queryString, [user_email], (err, rows, fiels) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  login
};
