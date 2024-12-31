const userRouter = require("express").Router();
const { isAdmin, isAuth } = require("../../middlewares/auth");
const { uploadImg } = require("../../middlewares/file");
const {
  verifyToken,
  register,
  login,
  getUsers,
  getUserById,
  putUser,
  deleteUser
} = require("../controllers/user");

userRouter.post("/register", uploadImg("users").single("avatar"), register);
userRouter.post("/login", login);
userRouter.get("/verify", verifyToken);
userRouter.get("/", [isAdmin], getUsers);
userRouter.get("/:id", [isAuth], getUserById);
userRouter.put("/:id", [isAuth, uploadImg("users").single("avatar")], putUser);
userRouter.delete(
  "/:id",
  [isAuth, uploadImg("users").single("avatar")],
  deleteUser
);

module.exports = userRouter;
