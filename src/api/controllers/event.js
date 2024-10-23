const { deleteFile } = require("../../utils/functions/deleteFile");
const Event = require("../models/event");

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("attendees");

    console.log("getEvents ✅");
    return res.status(200).json({
      status: "success",
      message: "Eventos obtenidos con éxito",
      data: events
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al obtener los eventos",
      error: error.message
    });
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate("attendees");

    console.log("getEventById ✅");
    return res.status(200).json({
      status: "success",
      message: "Evento obtenido con éxito",
      data: event
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al obtener el evento",
      error: error.message
    });
  }
};

const postEvent = async (req, res, next) => {
  try {
    const { title, description, date, duration } = req.body;

    if (!title || !date || !duration) {
      return res.status(400).json({
        status: "error",
        message:
          "Fallo en el registro, faltan campos requeridos (título, fecha o duración)"
      });
    }

    const titleDuplicated = await Event.findOne({ title });
    if (titleDuplicated) {
      return res.status(400).json({
        status: "error",
        message: "Fallo en el registro, el título ya existe"
      });
    }

    if (description) {
      const descriptionDuplicated = await Event.findOne({ description });
      if (descriptionDuplicated) {
        return res.status(400).json({
          status: "error",
          message:
            "Fallo en el registro, ya existe un evento con la misma descripción"
        });
      }
    }

    const newEvent = new Event(req.body);

    if (req.file) {
      newEvent.img = req.file.path;
    }

    const savedNewEvent = await newEvent.save();

    console.log("postEvent ✅");
    return res.status(201).json({
      status: "success",
      message: "Evento creado con éxito",
      data: savedNewEvent
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al crear el evento",
      error: error.message
    });
  }
};

const putEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const oldEvent = await Event.findById(id);
    if (!oldEvent) {
      return res.status(404).json({
        status: "error",
        message: "Evento no encontrado"
      });
    }

    const { title, description, img, attendees, ...updatedData } = req.body;

    if (title) {
      const titleDuplicated = await Event.findOne({ title });
      if (titleDuplicated) {
        return res.status(400).json({
          status: "error",
          message: "Fallo en la actualización, el título ya existe"
        });
      }
      updatedData.title = title;
    }

    if (description) {
      const descriptionDuplicated = await Event.findOne({ description });
      if (
        descriptionDuplicated &&
        descriptionDuplicated._id.toString() !== id
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Fallo en la actualización, ya existe un evento con la misma descripción"
        });
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
    return res.status(200).json({
      status: "success",
      message: "Evento actualizado con éxito",
      data: updatedEvent
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al actualizar el evento",
      error: error.message
    });
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (deleteEvent && deletedEvent.img) deleteFile(deletedEvent.img);

    console.log("deleteEvent ✅");
    return res.status(200).json({
      status: "success",
      message: "Evento eliminado con éxito",
      data: deletedEvent
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al eliminar el evento",
      error: error.message
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  postEvent,
  putEvent,
  deleteEvent
};
