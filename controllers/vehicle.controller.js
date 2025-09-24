const vehicleModel = require('../models/vehicle.models.js');
const rideModel = require('../models/ride.models.js');

module.exports.register = async (req, res, next) => {
    const { vehicleType, numberPlate, color, model } = req.body;

    const lowCasePlate = numberPlate.toLowerCase();
    try {
        const isExists = await vehicleModel.findOne({ user: req.user.id, numberPlate: lowCasePlate, deleted: false });

        if (isExists) {
            return res.status(400).json({
                message: "Vehicle with this number plate already exists."
            });
        }
        await vehicleModel.create({
            user: req.user.id,
            vehicleType,
            numberPlate: lowCasePlate,
            color,
            model
        });
        return res.status(200).json({
            message: "Vehicle registered successfully."
        });
    } catch (error) {
        console.error("Error while deleting vehicle:", error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

module.exports.getVehicles = async (req, res, next) => {
    try {
        const vehicles = await vehicleModel.find({ user: req.user.id, deleted: false });
        res.status(200).json(vehicles);
    } catch (error) {
        console.error("Error while deleting vehicle:", error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

module.exports.deleteVehicles = async (req, res, next) => {
    const { numberPlate } = req.body;

    try {
        const vehicle = await vehicleModel.findOne({ user: req.user.id, numberPlate: numberPlate });

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found." });
        }

        const ride = await rideModel.findOne({
            vehicleDetails: vehicle._id,
            driver: req.user.id,
            status: { $in: ["pending", "progress"] }
        });
        if (ride) {
            return res.status(400).json({ message: "Cannot delete vehicle as it is in use in a current ride." });
        }

        vehicle.deleted = true;
        await vehicle.save();

        return res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        console.error("Error while deleting vehicle:", error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}