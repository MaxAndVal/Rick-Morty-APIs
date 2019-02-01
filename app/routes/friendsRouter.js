const express = require("express");
const friendsRouter = express.Router();
const {
  getFriendsOfUserById,
  addFriend,
  deleteFriend,
  searchForFriends,
  acceptedFriendship
} = require("../actions/friends");

friendsRouter.get("/", async (req, res) => {
  getFriendsOfUserById(req.user)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

friendsRouter.put("/:id2", async (req, res) => {
  acceptedFriendship(req.user, req.params.id2)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

friendsRouter.get("/search/:new_friends", async (req, res) => {
  searchForFriends(req.user, req.params.new_friends)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

friendsRouter.post("/:id2", async (req, res) => {
  addFriend(req.user, req.params.id2)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});

friendsRouter.delete("/:id2", async (req, res) => {
  deleteFriend(req.user, req.params.id2)
    .then(response => {
      res.json(response);
    })
    .catch(error => res.send(error));
});
//doublon ??
// friendsRouter.get("/:id", async (req, res) => {
//   getFriendsOfUserById(req.params.id)
//     .then(response => {
//       res.json(response);
//     })
//     .catch(error => res.send(error));
// });

module.exports = friendsRouter;
