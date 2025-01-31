const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User ',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ["car", "bike"],
    required: true
  },
  numberPlate: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  }, 
  deleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;