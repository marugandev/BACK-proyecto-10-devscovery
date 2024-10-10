const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: {
      type: String,
      trim: true,
      default: "No description provided"
    },
    date: { type: Date, required: true, trim: true },
    duration: { type: Number, required: true, trim: true },
    img: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "TBD" },
    isVirtual: { type: Boolean, default: false },
    virtualLink: { type: String, trim: true, default: "" },
    organizer: { type: String, trim: true, default: "Unknown organizer" },
    maxAttendees: { type: Number, default: 100 },
    attendees: [{ type: mongoose.Types.ObjectId, ref: "users" }]
  },
  {
    timestamps: true,
    collection: "events"
  }
);

const Event = mongoose.model("events", eventSchema, "events");

module.exports = Event;
