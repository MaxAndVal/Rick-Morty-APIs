const isHeroku = process.env.NODE_ENV === "production";
const mysql = require("mysql");
console.log("NODE_ENV", process.env.NODE_ENV);
let env,
  connection,
  prodHost,
  prodUser,
  prodPassword,
  prodDatabase = "";

if (isHeroku) {
  prodHost = process.env.prodHost;
  prodUser = process.env.prodUser;
  prodPassword = process.env.prodPassword;
  prodDatabase = process.env.prodDatabase;
} else {
  env = { devIUT, devLocal, devHeroku } = require("./config");
}
if (process.env.NODE_ENV === undefined) {
  prodHost = devHeroku.host;
  prodUser = devHeroku.user;
  prodPassword = devHeroku.password;
  prodDatabase = devHeroku.database;
}

if (process.env.NODE_ENV === "developmentIUT") {
  connection = mysql.createConnection({
    host: env.devIUT.host,
    user: env.devIUT.user,
    password: env.devIUT.password,
    database: env.devIUT.database,
    port: env.devIUT.port
  });
} else if (process.env.NODE_ENV === "developmentLinux") {
  connection = mysql.createConnection({
    host: env.devLocal.host,
    user: env.devLocal.user,
    password: env.devLocal.password,
    database: env.devLocal.database
  });
} else {
  connection = mysql.createConnection({
    connectionLimit: 10,
    host: "db4free.net",
    user: "maxandval",
    password: "R0ck&R0llBDD",
    database: "melkiusetzigoval",
    port: 3307
  });
}

module.exports = connection;

// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host:
//   user:
//   password:
//   database:
// });

// function getConnexion() {
//   console.log("connexion ok");
//   return pool;
// }
// const connection = getConnexion();
