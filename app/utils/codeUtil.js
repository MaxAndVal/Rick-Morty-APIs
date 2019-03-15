const randomCode = numberOfChar => {
  var code = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < numberOfChar; i++)
    code += possible.charAt(Math.floor(Math.random() * possible.length));

  return code;
};
module.exports = { randomCode };
