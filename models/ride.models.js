const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  passengers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  vehicleDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  leaveDateTime: {
    type: Date,
    required: true,
    default: function () {
      return new Date(this.datetime.getTime() + 30 * 60000);
    }
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  availableSeats: {
    type: Number,
    min: 0,
    default: function () {
      return this.seats;
    }
  },
  status: {
    type: String,
    enum: ["pending", "progress", "completed", "canceled"],
    required: true,
    default: "pending"
  }
}, { timestamps: true });

RideSchema.index({ status: 1, datetime: 1 });

const Ride = mongoose.model('Ride', RideSchema);

module.exports = Ride;