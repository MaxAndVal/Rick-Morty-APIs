//userRouter for users
const express = require("express");
const authRouter = express.Router();
const { login } = require("../actions/auth");

authRouter.post("/login", async (req, res) => {
  login(req.body.user_email, req.body.user_password)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

module.exports = authRouter;
