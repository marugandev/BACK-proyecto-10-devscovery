const { generateSign, verifyJwt } = require("../../utils/functions/jwt");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { deleteFile } = require("../../utils/functions/deleteFile");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Token no proporcionado"
    });
  }

  try {
    const decodedToken = await verifyJwt(token);
    return res.status(200).json({
      status: "success",
      user: decodedToken
    });
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: error.message
    });
  }
};

const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        status: "error",
        message:
          "Fallo en el registro, faltan campos requeridos (nombre de usuario, correo electrónico o contraseña)"
      });
    }

    const userNameDuplicated = await User.findOne({ userName });
    if (userNameDuplicated) {
      return res.status(400).json({
        status: "error",
        message: "Fallo en el registro, el nombre de usuario ya existe"
      });
    }

    const emailDuplicated = await User.findOne({ email });
    if (emailDuplicated) {
      return res.status(400).json({
        status: "error",
        message: "Fallo en el registro, el correo electrónico ya existe"
      });
    }

    const newUser = new User(req.body);

    if (req.file) {
      newUser.avatar = req.file.path;
    }

    const newUserSaved = await newUser.save();

    const token = generateSign(newUserSaved._id);

    console.log("register ✅");
    return res.status(201).json({
      status: "success",
      message: "Registro realizado con éxito",
      user: newUserSaved,
      token
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Correo electrónico o contraseña incorrectos"
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSign(user._id);

      console.log("login ✅");
      return res.status(200).json({
        status: "success",
        message: "Acceso realizado con éxito",
        user,
        token
      });
    }

    return res.status(400).json({
      status: "error",
      message: "Correo electrónico o contraseña incorrectos"
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error
    });
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("favoriteEvents");

    console.log("getUsers ✅");
    return res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos correctamente",
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudieron obtener los usuarios",
      error
    });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para realizar esta acción"
      });
    }

    const user = await User.findById(id).populate("favoriteEvents");

    console.log("getUserById ✅");
    return res.status(200).json({
      status: "success",
      message: "Usuario obtenido correctamente",
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo obtener el usuario",
      error
    });
  }
};

const putUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && id !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message:
          req.user.role === "admin"
            ? "No autorizado como administrador"
            : "No autorizado como usuario"
      });
    }

    const oldUser = await User.findById(id);
    if (!oldUser) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    const { userName, email, password, favoriteEvents } = req.body;

    const updatedData = {};

    if (userName) {
      const userNameDuplicated = await User.findOne({ userName });
      if (userNameDuplicated && userNameDuplicated._id.toString() !== id) {
        return res.status(400).json({
          status: "error",
          message: "Fallo en la actualización, el nombre de usuario ya existe"
        });
      }
      updatedData.userName = userName;
    }

    if (email) {
      const emailDuplicated = await User.findOne({ email });
      if (emailDuplicated && emailDuplicated._id.toString() !== id) {
        return res.status(400).json({
          status: "error",
          message: "Fallo en la actualización, el correo electrónico ya existe"
        });
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
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    console.log(
      req.user.role === "admin"
        ? "Usuario actualizado por el administrador"
        : "Usuario actualizado por sí mismo"
    );
    return res.status(200).json({
      status: "success",
      message: "Usuario actualizado con éxito",
      user: newUserUpdated
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && id !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message:
          req.user.role === "admin"
            ? "No autorizado como administrador"
            : "No autorizado como usuario"
      });
    }

    const userDeleted = await User.findByIdAndDelete(id);

    if (userDeleted && userDeleted.avatar) {
      deleteFile(userDeleted.avatar);
    }

    if (!userDeleted) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    console.log(
      req.user.role === "admin"
        ? "Usuario eliminado por el administrador"
        : "Usuario eliminado por sí mismo"
    );
    return res.status(200).json({
      status: "success",
      message: "Usuario eliminado exitosamente",
      user: userDeleted
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error
    });
  }
};

module.exports = {
  verifyToken,
  register,
  login,
  getUsers,
  getUserById,
  putUser,
  deleteUser
};
