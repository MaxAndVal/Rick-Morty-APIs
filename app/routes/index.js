const express = require("express");
const app = express.Router();

const homeRouter = require("./homeRouter");
const usersRouter = require("./usersRouter");
const cardsRouter = require("./cardsRouter");
const authRouter = require("./authRouter");
const kaamelottRouter = require("./kaamelottRouter");

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("/kaamelott", kaamelottRouter);
app.use("*", (req, res) => {
  res.status(404).json({ code: 404, error: "route not found" });
});

module.exports = app;
