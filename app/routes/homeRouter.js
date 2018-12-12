const express = require("express");
const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  res.send("Home Page - Rick And Morty API is ON");
});

module.exports = homeRouter;
