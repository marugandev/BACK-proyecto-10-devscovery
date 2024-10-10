require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../../api/models/user");
const users = require("../../data/users");
const Event = require("../../api/models/event");
const events = require("../../data/events");

const seed = async (model, modelName, data) => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected DB ✅");

    await model.collection.drop();
    console.log(`"${modelName} deleted from the DB 🔥"`);

    await model.insertMany(data);
    console.log(`"${modelName} added to the DB ⚡️"`);

    await mongoose.disconnect();
    console.log("Disconnected DB ❌");
  } catch (error) {
    console.log("Seed error", error);
  }
};

const runSeed = async () => {
  await seed(User, "Users", users);
  await seed(Event, "Events", events);
};

runSeed();
