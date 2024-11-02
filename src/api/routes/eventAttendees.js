const eventAttendeesRouter = require("express").Router();
const { isAuth } = require("../../middlewares/auth");

const putEventAttendees = require("../controllers/eventAttendees");

eventAttendeesRouter.put("/:eventId", [isAuth], putEventAttendees);

module.exports = eventAttendeesRouter;
