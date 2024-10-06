const bcrypt = require("bcrypt");

const verifyPassword = async (passwordProvided, originalPassword) => {
  try {
    return await bcrypt.compare(passwordProvided, originalPassword);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.authService = { verifyPassword };
