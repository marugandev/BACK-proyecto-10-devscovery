const jwt = require("jsonwebtoken");

const generateSign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const verifyJwt = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(new Error("Token inválido o expirado"));
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = { generateSign, verifyJwt };
