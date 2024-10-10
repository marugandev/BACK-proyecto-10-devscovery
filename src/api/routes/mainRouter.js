const mainRouter = require("express").Router();

const eventRouter = require("./event");
const userRouter = require("./user");

mainRouter.use("/events", eventRouter);
mainRouter.use("/users", userRouter);

module.exports = mainRouter;
