const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  properties: {
    Name: { type: String, required: true },
    description: { type: String, required: true },
    LONG: { type: Number, required: true },
    path: { type: String, required: true }
  },
  geometry: {
    type: {
      type: String,
      enum: ['MultiLineString'],
      required: true
    },
    coordinates: {
      type: [[[Number]]],
      required: true
    }
  }
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
//sapo//