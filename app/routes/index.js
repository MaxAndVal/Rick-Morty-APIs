const express = require("express");
const app = express.Router();

const homeRouter = require("./homeRouter");
const usersRouter = require("./usersRouter");
const cardsRouter = require("./cardsRouter");
const authRouter = require("./authRouter");
const kaamelottRouter = require("./kaamelottRouter");
const soundsRouter = require("./soundsRouter");
const faqRouter = require("./faqRouter");

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("/kaamelott", kaamelottRouter);

//Not use for now, need to find a way
app.use("/sounds", soundsRouter);

app.use("/faq", faqRouter);
app.use("*", (req, res) => {
  res.json({ code: 404, error: "route not found" });
});

module.exports = app;
