//userRouter for users
const express = require("express");
const userRouter = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
  setGameDate,
  getDeckToOpen
} = require("../actions/users");
const { getDeckById } = require("../actions/cards");
const { updateWallet } = require("../actions/wallet");
const { getWallet } = require("../actions/wallet");
const friendsRouter = require("./friendsRouter.js");
const cardsRouter = require("./cardsRouter");
const marketRouter = require("./marketRouter");

userRouter.get("/all", async (req, res) => {
  getAllUsers()
    .then(users => res.json(users))
    .catch(err => {
      res.send(err);
    });
});

userRouter.delete("/:id", async (req, res) => {
  deleteUserById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.send(err));
});

userRouter.get("/deck/:id", async (req, res) => {
  getDeckById(req.params.id)
    .then(deck => res.json(deck))
    .catch(err => res.send(err));
});

userRouter.get("/:id", async (req, res) => {
  getUserById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.send(err));
});

userRouter.post("/", async (req, res) => {
  createUser(req.body.user_name, req.body.user_email, req.body.user_password)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

userRouter.put("/wallet/:id", async (req, res) => {
  updateWallet(req.params.id, req.body.newWallet)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

userRouter.get("/wallet/:id", async (req, res) => {
  getWallet(req.params.id)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

userRouter.put("/playGame/:id", async (req, res) => {
  console.log("date : ", req.params.newDate);
  setGameDate(req.params.id, req.body.newDate)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

userRouter.get("/:id/decktoopen", async (req, res) => {
  getDeckToOpen(req.params.id)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

//userRouter.use("/:user/friends", friendsRouter);
userRouter.use(
  "/:user/friends",
  function(req, res, next) {
    req.user = req.params.user;
    next();
  },
  friendsRouter
);
userRouter.use(
  "/:user/cards",
  function(req, res, next) {
    req.user = req.params.user;
    next();
  },
  cardsRouter
);

userRouter.use(
  "/:user/market",
  function(req, res, next) {
    req.user = req.params.user;
    next();
  },
  marketRouter
);

module.exports = userRouter;
