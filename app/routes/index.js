const express = require("express");
const app = express.Router();

const homeRouter = require("./homeRouter");
const usersRouter = require("./usersRouter");
const cardsRouter = require("./cardsRouter");
const authRouter = require("./authRouter");
const kaamelottRouter = require("./kaamelottRouter");
const friendsRouter = require("./friendsRouter.js");

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("/kaamelott", kaamelottRouter);
app.use("/friends", friendsRouter);
app.use("*", (req, res) => {
  res.json({ code: 404, error: "route not found" });
});

module.exports = app;
