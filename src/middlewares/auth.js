const User = require("../api/models/user");
const { verifyJwt } = require("../utils/functions/jwt");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json("Not authorized ❌");
    }

    const parsedToken = token.replace("Bearer ", "");
    const { id } = verifyJwt(parsedToken);

    const user = await User.findById(id);

    if (user.role === "admin") {
      user.password = null;
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "Not authorized ❌, only admin" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json("Not authorized ❌");
    }

    const parsedToken = token.replace("Bearer ", "");
    const { id } = verifyJwt(parsedToken);

    const user = await User.findById(id);

    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = { isAdmin, isAuth };
