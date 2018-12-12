//userRouter for users
const express = require("express");
const userRouter = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById
} = require("../actions/users");

userRouter.get("/getAllUsers", (req, res) => {
  getAllUsers()
    .then(users => res.json(users))
    .catch(err => {
      res.send(err);
    });
});

userRouter.delete("/:id", (req, res) => {
  deleteUserById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.send(err));
});

userRouter.get("/:id", (req, res) => {
  getUserById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.send(err));
});

userRouter.post("/", async (req, res) => {
  createUser(req.body.user_name, req.body.user_email, req.body.user_password)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

module.exports = userRouter;
