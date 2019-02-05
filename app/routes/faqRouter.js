const express = require("express");
const faqRouter = express.Router();
const { getAllFaq } = require("../actions/faq");

faqRouter.get("/", async (req, res) => {
  getAllFaq()
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

module.exports = faqRouter;
