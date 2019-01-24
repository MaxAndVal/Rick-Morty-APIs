//userRouter for users
const express = require("express");
const authRouter = express.Router();
const { login } = require("../actions/auth");

authRouter.post("/login", async (req, res) => {
  login(req.body.user_email, req.body.user_password, req.body.user_name, req.body.external_id)
    .then(response => res.json(response))
    .catch(err => res.send(err));
});

module.exports = authRouter;
