const bcrypt = require("bcryptjs");

exports.comparePasswords = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
