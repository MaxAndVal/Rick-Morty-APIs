const randomCode = () => {
  var code = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++) code += possible.charAt(Math.floor(Math.random() * possible.length));

  return code;
};
module.exports = { randomCode };
