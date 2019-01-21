const express = require("express");
const friendsRouter = express.Router();
const { getFriendsOfUserById, addFriend, deleteFriend } = require("../actions/friends");

friendsRouter.get("/:id", async (req, res) => {
  getFriendsOfUserById(req.params.id)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

friendsRouter.post("/:id1&:id2", async (req, res) => {
  addFriend(req.params.id1, req.params.id2)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

friendsRouter.delete("/:id1&:id2", async (req, res) => {
  deleteFriend(req.params.id1, req.params.id2)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

friendsRouter.get("/:id", async (req, res) => {
  getFriendsOfUserById(req.params.id)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

module.exports = friendsRouter;
