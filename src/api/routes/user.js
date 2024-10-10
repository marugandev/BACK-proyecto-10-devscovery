const userRouter = require("express").Router();
const { isAdmin, isAuth } = require("../../middlewares/auth");
const { uploadImg } = require("../../middlewares/file");
const {
  register,
  login,
  getUsers,
  getUserById,
  putUser,
  deleteUser
} = require("../controllers/user");

userRouter.post("/register", uploadImg("users").single("avatar"), register);
userRouter.post("/login", login);
userRouter.get("/", [isAdmin], getUsers);
userRouter.get("/:id", [isAdmin], getUserById);
userRouter.put("/:id", [isAuth, uploadImg("users").single("avatar")], putUser);
userRouter.delete(
  "/:id",
  [isAuth, uploadImg("users").single("avatar")],
  deleteUser
);

module.exports = userRouter;
