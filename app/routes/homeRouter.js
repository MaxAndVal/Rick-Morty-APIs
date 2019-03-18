const express = require("express");
const homeRouter = express.Router();
const connection = require("../../dbConnexion/index");

homeRouter.get("/", (req, res) => {
  awakeDB(), res.send("Home Page - Rick And Morty API is ON");
});

const awakeDB = () => {
  const query = "SELECT user_name FROM users WHERE user_id=-1";
  connection.query(query, (err, rows, fields) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = homeRouter;
