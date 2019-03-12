const connection = require("../../dbConnexion");
const { omit } = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 6;
const { insertNewUser } = require("./users");

var nodemailer = require("nodemailer");

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
  return new Promise((resolve, reject) => {
    const queryString = "SELECT * FROM users WHERE user_email=? AND external_id IS NULL";
    connection.query(queryString, [user_email], (err, rows, fields) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rickandmorty.tcg@gmail.com",
    pass: "maxandval"
  }
});

async function lostPassword(user_email) {
  return new Promise((resolve, reject) => {
    const queryString = "SELECT * FROM users WHERE user_email=? AND external_id IS NULL";
    connection.query(queryString, [user_email], (err, rows, fields) => {
      if (err) {
        reject(err);
      }
      console.log(rows);
      if (rows.length > 0) {
        console.log("in if ", user_email);
        var mailOptions = {
          from: "rickandmorty.tcg@gmail.com",
          to: user_email,
          subject: "Sending Email using Node.js",
          text: "Yes ! it's from node.js"
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
      resolve({ code: 200, message: "email sent" });
    });
  });
}
module.exports = {
  login,
  lostPassword
};
