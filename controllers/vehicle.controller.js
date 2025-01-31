const vehicleModel = require('../models/vehicle.models.js');
const rideModel = require('../models/ride.models.js');

module.exports.register = async (req, res, next) => {
    const { vehicleType, numberPlate, color, model } = req.body;

    if(!vehicleType || !numberPlate || !color || !model){
        return res.status(401).json({
            error: "All 4 fields are required."
        })
    }
    const lowCasePlate = numberPlate.toLowerCase();

    const isExists = await vehicleModel.findOne({ user: req.user.id, numberPlate: lowCasePlate, deleted: false });
    if(isExists){
        return res.status(400).json({
            message: "Vehicle with this number plate already exists."
        });
    }
    await vehicleModel.create({
        user: req.user.id,
        vehicleType, 
        numberPlate:lowCasePlate, 
        color, 
        model
    });
    return res.status(200).json({
        message: "Vehicle registered successfully."
    });
}

module.exports.getVehicles = async (req, res, next) => {
    const vehicles = await vehicleModel.find({ user: req.user.id, deleted: false });
    return res.status(200).json({
        vehicles
    })
}

module.exports.deleteVehicles = async (req, res, next) => {
    const { numberPlate } = req.body; 
    if(!numberPlate){
        return res.status(401).json({message: "Please provide numberPlate with request."});
    }
    const vehicle = await vehicleModel.findOne({ user: req.user.id, numberPlate: numberPlate });

    const ride = await rideModel.findOne({ 
        vehicleDetails: vehicle._id, 
        driver: req.user.id, 
        status: { $in: ["pending", "progress"] }
    });
    if(ride){
        return res.status(401).json({message: "Cannot delete vehicle as it is in use in a current ride."});
    }

    vehicle.deleted = true;
    await vehicle.save();
    
    return res.status(200).json({message: "Vehicle deleted successfully"});
}