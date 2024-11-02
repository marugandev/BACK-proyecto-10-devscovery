const mainRouter = require("express").Router();

const eventRouter = require("./event");
const userRouter = require("./user");
const eventAttendeesRouter = require("./eventAttendees");

mainRouter.use("/events", eventRouter);
mainRouter.use("/users", userRouter);
mainRouter.use("/events/attendees", eventAttendeesRouter);

module.exports = mainRouter;
