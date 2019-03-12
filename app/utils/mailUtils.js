const nodemailer = require("nodemailer");
const { randomCode } = require("./codeUtil");
const setEmailPassword = require("../../mailing/setEmailPassword");
const setWelcomeEmail = require("../../mailing/setEmailWelcome");
const { EMAIL_CONFIG } = require("../../dbConnexion/config");
const isHeroku = process.env.NODE_ENV === "production";

if (isHeroku) {
  prodEmailUser = process.env.prodEmailUser;
  prodEmailPass = process.env.prodEmailPass;
}

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: isHeroku ? prodEmailUser : EMAIL_CONFIG.user,
    pass: isHeroku ? prodEmailPass : EMAIL_CONFIG.pass
  }
});

const lostPasswordMail = user_email => {
  const code = randomCode();
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
    html: setWelcomeEmail(user_email)
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
