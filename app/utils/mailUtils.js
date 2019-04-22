const nodemailer = require("nodemailer");
const setEmailPassword = require("../../mailing/setEmailPassword");
const setWelcomeEmail = require("../../mailing/setEmailWelcome");
const isHeroku = process.env.NODE_ENV === "production";
var eUser = "";
var ePass = "";
if (isHeroku) {
  eUser = process.env.prodEmailUser;
  ePass = process.env.prodEmailPass;
} else {
  const { EMAIL_CONFIG } = require("../../dbConnexion/config");
  eUser = ""; //EMAIL_CONFIG.user;
  ePass = ""; //EMAIL_CONFIG.pass;
}

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: eUser,
    pass: ePass
  }
});

const lostPasswordMail = (user_email, code) => {
  var mailOptions = {
    from: "rickandmorty.tcg@gmail.com",
    to: user_email,
    subject: "Reinitialisation de votre mot de passe",
    html: setEmailPassword(code)
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const welcomeMail = (user_email, user_name) => {
  var mailOptions = {
    from: "rickandmorty.tcg@gmail.com",
    to: user_email,
    subject: "l'Equipe de Rick And Morty vous souhaite la bienvenue !",
    html: setWelcomeEmail(user_name)
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { welcomeMail, lostPasswordMail };
