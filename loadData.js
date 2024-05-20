// loadData.js

const fs = require("fs");
const mongoose = require("mongoose");
const Route = require("./models/route");
require('dotenv').config()



const dbUrl = process.env.MONGODB_URI;


mongoose
  .connect(dbUrl)
  .then(async () => {
    console.log("Connected to database");

    const data = JSON.parse(fs.readFileSync("./assets/rutas.geojson", "utf8"));

    await Route.deleteMany({});

    await Route.insertMany(data.features);

    console.log("Data inserted");
    mongoose.disconnect();
  })
  .catch((e) => {
    console.error(`Error connecting to the database.\n${e}`);
  });
