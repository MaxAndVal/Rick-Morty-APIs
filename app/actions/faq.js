const connection = require("../../dbConnexion");
const { omit } = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 6;
const { insertNewUser } = require("./users");

getAllFaq = async () => {
  return new Promise((resolve, reject) => {
    queryString = "SELECT faq_question, faq_response FROM faq";
    connection.query(queryString, (err, rows, fields) => {
      if (err) {
        console.log("Failed  " + err);
        return reject({ code: 500, message: err.errorno });
      }
      resolve({ code: 200, message: "success faq", faq: rows });
    });
  });
};

module.exports = { getAllFaq };
