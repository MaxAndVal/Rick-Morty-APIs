const express = require("express");
const friendsRouter = express.Router();
const { getFriendsOfUserById } = require("../actions/friends");

friendsRouter.get("/:id", (req, res) => {
  getFriendsOfUserById(req.params.id).then(response => {
    res.json(response.data).catch(error => res.send(error));
  });
});

module.exports = friendsRouter;
