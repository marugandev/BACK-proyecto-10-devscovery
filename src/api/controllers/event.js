const { deleteFile } = require("../../utils/functions/deleteFile");
const Event = require("../models/event");

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("attendees");

    console.log("getEvents ✅");
    return res.status(200).json(events);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate("attendees");

    console.log("getEventById ✅");
    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const postEvent = async (req, res, next) => {
  try {
    const { title, description, date, duration } = req.body;

    if (!title || !date || !duration) {
      return res
        .status(400)
        .json(
          "Failed to create, missing required fields (title, date, or duration) 😔"
        );
    }

    const titleDuplicated = await Event.findOne({ title });
    if (titleDuplicated) {
      return res.status(400).json("Failed to create, title already exists 😔");
    }

    if (description) {
      const descriptionDuplicated = await Event.findOne({ description });
      if (descriptionDuplicated) {
        return res
          .status(400)
          .json("Failed to create, the same description already exists 😔");
      }
    }

    const newEvent = new Event(req.body);

    if (req.file) {
      newEvent.img = req.file.path;
    }

    const savedNewEvent = await newEvent.save();

    console.log("postEvent ✅");
    return res.status(201).json(savedNewEvent);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const putEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const oldEvent = await Event.findById(id);
    if (!oldEvent) {
      return res.status(400).json({ message: "Event not found 😔" });
    }

    const { title, description, img, attendees, ...updatedData } = req.body;

    if (title) {
      const titleDuplicated = await Event.findOne({ title });
      if (titleDuplicated) {
        return res
          .status(400)
          .json("Failed to update, title already exists 😔");
      }
      updatedData.title = title;
    }

    if (description) {
      const descriptionDuplicated = await Event.findOne({ description });
      if (
        descriptionDuplicated &&
        descriptionDuplicated._id.toString() !== id
      ) {
        return res
          .status(400)
          .json("Failed to update, the same description already exist 😔");
      }
      updatedData.description = description;
    }

    if (req.file) {
      updatedData.img = req.file.path;

      deleteFile(oldEvent.img);
    }

    if (attendees && attendees.length > 0) {
      updatedData.$addToSet = { attendees: { $each: attendees } };
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    console.log("putEvent ✅");
    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (deletedEvent.img) deleteFile(deletedEvent.img);

    console.log("deleteEvent ✅");
    return res.status(200).json(deletedEvent);
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  postEvent,
  putEvent,
  deleteEvent
};
