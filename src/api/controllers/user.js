const { generateSign } = require("../../utils/functions/jwt");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { deleteFile } = require("../../utils/functions/deleteFile");

const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res
        .status(400)
        .json(
          "Failed to register, missing required fields (userName, email, or password) 😔"
        );
    }

    const userNameDuplicated = await User.findOne({ userName });
    if (userNameDuplicated) {
      return res
        .status(400)
        .json("Failed to register, username already exist 😔");
    }

    const emailDuplicated = await User.findOne({ email });
    if (emailDuplicated) {
      return res
        .status(400)
        .json("Failed to register, email already exists 😔");
    }

    const newUser = new User(req.body);

    if (req.file) {
      newUser.avatar = req.file.path;
    }

    const newUserSaved = await newUser.save();

    console.log("register ✅");
    return res.status(201).json(newUserSaved);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("Email or password not valid 😔");
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSign(user._id);

      return res.status(201).json({ user, token });
    }

    console.log("login ✅");
    return res.status(400).json("Email or password not valid 😔");
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("favoriteEvents");

    console.log("getUsers ✅");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate("favoriteEvents");

    console.log("getUserById ✅");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const putUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && id !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          req.user.role === "admin"
            ? "Not authorized as admin ❌"
            : "Not authorized as user ❌"
        );
    }

    const oldUser = await User.findById(id);
    if (!oldUser) {
      return res.status(404).json({ message: "User not found 😔" });
    }

    const { userName, email, password, favoriteEvents } = req.body;

    const updatedData = {};

    if (userName) {
      const userNameDuplicated = await User.findOne({ userName });
      if (userNameDuplicated && userNameDuplicated._id.toString() !== id) {
        return res
          .status(400)
          .json("Failed to update, username already exists 😔");
      }
      updatedData.userName = userName;
    }

    if (email) {
      const emailDuplicated = await User.findOne({ email });
      if (emailDuplicated && emailDuplicated._id.toString() !== id) {
        return res
          .status(400)
          .json("Failed to update, email already exists 😔");
      }
      updatedData.email = email;
    }

    if (req.file) {
      updatedData.avatar = req.file.path;

      deleteFile(oldUser.avatar);
    }

    if (favoriteEvents) {
      const eventsArray = Array.isArray(favoriteEvents)
        ? favoriteEvents
        : [favoriteEvents];
      updatedData.$addToSet = { favoriteEvents: { $each: eventsArray } };
    }

    if (password) {
      updatedData.password = bcrypt.hashSync(password, 10);
    }

    const newUserUpdated = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!newUserUpdated) {
      return res.status(404).json({ message: "User not found 😔" });
    }

    console.log(
      req.user.role === "admin"
        ? "User updated by admin 🔥"
        : "User updated by self 🔥"
    );
    return res.status(200).json(newUserUpdated);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && id !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          req.user.role === "admin"
            ? "Not authorized as admin ❌"
            : "Not authorized as user ❌"
        );
    }

    const userDeleted = await User.findByIdAndDelete(id);

    if (userDeleted.avatar) deleteFile(userDeleted.avatar);

    if (!userDeleted) {
      return res.status(404).json({ message: "User not found 😔" });
    }

    console.log(
      req.user.role === "admin"
        ? "User deleted by admin 🔥"
        : "User deleted by self 🔥"
    );
    return res.status(200).json(userDeleted);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  putUser,
  deleteUser
};
