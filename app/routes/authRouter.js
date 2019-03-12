//userRouter for users
const express = require("express");
const authRouter = express.Router();
const { login, lostPassword } = require("../actions/auth");

authRouter.post("/login", async (req, res) => {
  login(
    req.body.user_email,
    req.body.user_password,
    req.body.user_name,
    req.body.external_id,
    req.body.user_image
  )
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

authRouter.post("/lostpassword", async (req, res) => {
  lostPassword(req.body.user_email)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

module.exports = authRouter;
