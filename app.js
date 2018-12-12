const express = require("express");
const app = express();
const morgan = require("morgan");
const router = require("./app/routes");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(morgan("short"));
app.use(router);

const PORT = process.env.PORT || 14000;
app.listen(PORT, () => {
  console.log("fix : Server is up and listening : ", PORT);
});
