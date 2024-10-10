const eventRouter = require("express").Router();
const { isAdmin } = require("../../middlewares/auth");
const { uploadImg } = require("../../middlewares/file");

const {
  getEvents,
  getEventById,
  postEvent,
  putEvent,
  deleteEvent
} = require("../controllers/event");

eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.post("/", [isAdmin, uploadImg("events").single("img")], postEvent);
eventRouter.put("/:id", [isAdmin, uploadImg("events").single("img")], putEvent);
eventRouter.delete(
  "/:id",
  [isAdmin, uploadImg("events").single("img")],
  deleteEvent
);

module.exports = eventRouter;
