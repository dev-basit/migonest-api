const bcrypt = require("bcrypt");

const verifyPassword = async (currentPlainPassword, hashedPassword) => {
  try {
    if (!currentPlainPassword || !hashedPassword) {
      throw new Error("Both current plain password and hashed password are required.");
    }

    return await bcrypt.compare(currentPlainPassword, hashedPassword);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.authService = { verifyPassword };
