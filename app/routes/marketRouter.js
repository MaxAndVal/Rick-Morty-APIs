const express = require("express");
const marketRouter = express.Router();
const { getMarketOfUser, addCardtoMarket, changePrice, buyCard } = require("../actions/market");

marketRouter.get("/", async (req, res) => {
  getMarketOfUser(req.user)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

marketRouter.post("/:card_id", async (req, res) => {
  addCardtoMarket(req.user, req.params.card_id, req.body.card_name, req.body.price)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

marketRouter.get("/:friend", async (req, res) => {
  getMarketOfUser(req.params.friend)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

marketRouter.post("/:friend/buycard/:card_id", async (req, res) => {
  buyCard(req.user, req.params.friend, req.params.card_id, req.body.card_name, req.body.price)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

module.exports = marketRouter;
