const express = require("express");
const soundsRouter = express.Router();
const axios = require("axios");

soundsRouter.get("/pickleRick", async (req, res) => {
  axios
    .get("http://peal.io/p/pickle-rick")
    .then(response => {
      res.send(response);
    })
    .catch(error => {
      res.send(error);
    });
});

module.exports = soundsRouter;
