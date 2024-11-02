const Event = require("../models/event");
const User = require("../models/user");

const putEventAttendees = async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Evento no encontrado"
      });
    }

    const isAttending = event.attendees.includes(userId);

    await Event.findByIdAndUpdate(
      eventId,
      isAttending
        ? {
            $pull: { attendees: userId }
          }
        : {
            $addToSet: { attendees: userId }
          },
      {
        new: true,
        runValidators: true
      }
    );

    await User.findByIdAndUpdate(
      userId,
      isAttending
        ? {
            $pull: { favoriteEvents: eventId }
          }
        : {
            $addToSet: { favoriteEvents: eventId }
          },
      {
        new: true,
        runValidators: true
      }
    );

    console.log("putEventAttendees ✅");
    res.status(200).json({
      status: "success",
      message: isAttending
        ? "Asistencia cancelada con éxito"
        : "Asistencia registrada con éxito",
      event,
      userId
    });
  } catch (error) {
    /*       console.error(error); */
    res.status(500).json({
      status: "error",
      message: "Fallo al registrar la asistencia",
      error
    });
  }
};

module.exports = putEventAttendees;
