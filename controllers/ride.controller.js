const rideModel = require('../models/ride.models.js');
const mongoose = require('mongoose');
const User = require('../models/user.models.js');
const cron = require('node-cron');
const { getIoInstance } = require('../socket');

module.exports.createRide = async (req, res, next) => {
    const { from, to, datetime, fare, seats, vehicleDetails } = req.body;

    try {
        const ispending = await rideModel.findOne({ driver: req.user.id, status: { $in: ["pending", "progress"] } });
        if (ispending) {
            return res.status(400).json({
                message: "You have already created a ride that is in progress."
            });
        }

        const isPassengerInActiveRide = await rideModel.findOne({
            passengers: req.user.id,
            status: { $in: ["pending", "progress"] }
        });

        if (isPassengerInActiveRide) {
            return res.status(400).json({
                message: "You are currently a passenger in another active ride."
            });
        }

        const selectedTime = new Date(datetime);
        const currentTime = new Date();

        if (selectedTime <= currentTime) {
            return res.status(400).json({
                message: "The selected time must be in the future"
            });
        }

        await rideModel.create({
            from,
            to,
            datetime,
            fare,
            seats,
            vehicleDetails,
            driver: req.user.id
        });

        const io = getIoInstance();
        io.emit('newRide');

        return res.status(200).json({
            message: "Ride Created successfully."
        });
    } catch (error) {
        console.error("Error creating Ride:", error);
        return res.status(500).json({
            message: "An error occurred while creating your ride. Please try again later."
        });
    }
}

const groupRidesByDate = (rides) => {
    return rides.reduce((grouped, ride) => {
        const dateKey = new Date(ride.datetime).toLocaleDateString(); // Format date as 'MM/DD/YYYY'
        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        grouped[dateKey].push(ride);
        return grouped;
    }, {});
};

module.exports.getAvailableRides = async (filters) => {
    try {
        const query = {};

        if (filters.from) query.from = new RegExp(filters.from, 'i'); // Case-insensitive search
        if (filters.to) query.to = new RegExp(filters.to, 'i'); // Case-insensitive search
        if (filters.fare) query.fare = filters.fare; // Range query for fare
        query.availableSeats = { $gte: 1 };
        query.status = "pending";

        let rides = await rideModel
            .find(query)
            .sort({ datetime: 1 }) // Sort by date and time
            .populate('driver', 'firstName lastName img') // Populate driver details
            .populate('vehicleDetails', 'model vehicleType'); // Populate vehicle details

        if (filters.vehicleDetails?.type) {
            rides = rides.filter(ride => ride.vehicleDetails?.vehicleType === filters.vehicleDetails.type);
        }

        rides = groupRidesByDate(rides)
        return rides;
    } catch (error) {
        console.error('Error fetching rides:', error);
        throw new Error('Unable to fetch rides');
    }
};

module.exports.getRidebyId = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        let ride = await rideModel
            .findById(id)
            .populate('driver', 'firstName lastName img department phone') // Populate driver details
            .populate('vehicleDetails', 'model vehicleType color numberPlate')
            .populate('passengers', 'img firstName lastName department phone');

        return ride ? ride : null;

    } catch (error) {
        console.error('Error fetching ride by Id:', error);
        throw new Error('Unable to fetch ride by Id');
    }
}

module.exports.joinRide = async (req, res, next) => {
    const { rideId } = req.body;
    const userId = req.user.id;

    try {
        const ride = await rideModel.findOne({ _id: rideId, status: "pending" });

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.availableSeats <= 0 || isNaN(ride.availableSeats)) {
            return res.status(400).json({ message: 'No seats available' });
        }

        if (ride.driver.toString() === userId) {
            return res.status(400).json({ message: 'You cannot join your own ride' });
        }

        if (ride.passengers.includes(userId)) {
            return res.status(400).json({ message: 'You already joined the ride' });
        }

        const activeRide = await rideModel.findOne({
            $or: [
                { passengers: userId, status: "pending" },
                { driver: userId, status: "pending" }
            ]
        });

        if (activeRide) {
            return res.status(400).json({ message: 'You cannot join more than one active ride' });
        }

        const updatedRide = await rideModel.findOneAndUpdate(
            { _id: rideId, availableSeats: { $gt: 0 } },
            { $push: { passengers: userId }, $inc: { availableSeats: -1 } },
            { new: true }
        );

        if (!updatedRide) {
            return res.status(400).json({ message: 'Failed to join ride. Please try again.' });
        }

        const io = getIoInstance();
        io.emit('decreaseSeat', rideId);

        return res.status(200).json({
            message: "Ride joined successfully!"
        });
    } catch (error) {
        console.error("error while joining ride", error);
        res.status(500).json({ message: 'An error occurred while joining the ride' });
    }
};

module.exports.getAsaDriverRide = async (req, res, next) => {

    try {
        const rideHistory = await rideModel.find({
            driver: req.user.id,
            status: { $in: ["completed", "canceled"] }
        }).sort({ datetime: -1 });


        if (!rideHistory) {
            return res.status(400).json({
                message: "No Rides available as a driver."
            })
        }
        return res.json(rideHistory);
    } catch (error) {
        console.error("Error fetching History of Rides:", error);
        return res.status(500).json({
            error: "An error occurred while fetching History of Rides. Please try again later."
        });
    }
}

module.exports.getAsaPassengerRide = async (req, res, next) => {

    try {
        const rideHistory = await rideModel.find({
            passengers: req.user.id,
            status: { $in: ["completed", "canceled"] }
        }).sort({ datetime: -1 });


        if (!rideHistory) {
            return res.status(400).json({
                message: "No Rides available as a Passengers."
            })
        }
        return res.json(rideHistory);
    } catch (error) {
        console.error("Error fetching History of Rides:", error);
        return res.status(500).json({
            error: "An error occurred while fetching History of Rides. Please try again later."
        });
    }
}

module.exports.getRideByIdHistory = async (req, res, next) => {
    const { rideId } = req.body;
    try {
        let ride = await rideModel
            .findById(rideId)
            .populate('driver', 'firstName lastName img department')
            .populate('vehicleDetails', 'model vehicleType color numberPlate')
            .populate('passengers', 'img')

        if (!ride) {
            return res.status(400).json({
                error: "No ride found"
            })
        }
        return res.status(200).json(ride);
    } catch (error) {
        console.error('Error fetching ride by Id:', error);
        return res.status(500).json({
            error: "An error occurred while fetching ride. Please try again later."
        });
    }
}

module.exports.getHomePageRides = async (req, res, next) => {
    try {
        let query = { availableSeats: { $gte: 1 }, status: "pending" };

        let rides = await rideModel
            .find(query)
            .limit(2)
            .populate('driver', 'firstName lastName img')
            .populate('vehicleDetails', 'model vehicleType');

        return res.status(200).json(rides);
    } catch (error) {
        console.error('Error fetching home page rides:', error);
        return res.status(500).json({
            error: "An error occurred while fetching home page rides. Please try again later."
        });
    }
}

module.exports.getCurrentRide = async (req, res, next) => {
    try {
        const Dride = await rideModel.findOne({
            driver: req.user.id,
            status: { $in: ["pending", "progress"] }
        });

        if (Dride)
            return res.status(200).json({ ride: Dride, type: "driver" });

        const Pride = await rideModel.findOne({
            passengers: req.user.id,
            status: { $in: ["pending", "progress"] }
        });

        if (Pride)
            return res.status(200).json({ ride: Pride, type: "passenger" });

        return res.status(200).json({ message: "No current ride found" });

    } catch (error) {
        console.error('Error fetching current ride:', error);
        return res.status(500).json({
            error: "An error occurred while fetching current ride. Please try again later."
        });
    }
}

module.exports.cancelBooking = async (req, res, next) => {
    const { rideId } = req.body;
    const userId = req.user.id;

    try {
        const ride = await rideModel.findOne({ _id: rideId, status: "pending" });
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        if (!ride.passengers.includes(userId)) {
            return res.status(400).json({ error: 'You are not a passenger in this ride' });
        }

        const updatedRide = await rideModel.findOneAndUpdate(
            { _id: rideId },
            { $pull: { passengers: userId }, $inc: { availableSeats: 1 } },
            { new: true }
        );

        if (!updatedRide) {
            return res.status(400).json({ error: 'Failed to cancel booking. Please try again.' });
        }

        const notificationMessage = `A passenger has left the ride from ${ride.from} to ${ride.to}.`;
        await User.findByIdAndUpdate(
            ride.driver,
            { $push: { messages: { message: notificationMessage, read: false } } }
        );

        const io = getIoInstance();
        io.emit('increaseSeat', rideId);

        return res.status(200).json({
            message: "Booking canceled successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while leaving the ride' });
    }
}
module.exports.cancelRide = async (req, res, next) => {
    const { rideId } = req.body;
    const userId = req.user.id;
    
    try {
        const ride = await rideModel.findOne({ _id: rideId, status: "pending" });
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        if (!ride.driver.toString() === userId) {
            return res.status(400).json({ error: 'You are not Driver of this ride' });
        }

        const updatedRide = await rideModel.findOneAndUpdate(
            { _id: rideId },
            { status: "canceled" },
            { new: true }
        );

        if (!updatedRide) {
            return res.status(400).json({ error: 'Failed to cancel Ride. Please try again.' });
        }

        const notificationMessage = `The ride from ${ride.from} to ${ride.to} has been canceled by the driver.`;
        await User.updateMany(
            { _id: { $in: ride.passengers } },
            { $push: { messages: { message: notificationMessage } } }
        );

        const io = getIoInstance();
        io.emit('rideCanceled', rideId);

        return res.status(200).json({
            message: "Ride canceled successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while canceling the ride' });
    }
}

module.exports.removePassenger = async (req, res, next) => {
    const { rideId, passengerId } = req.body;

    try {
        const ride = await rideModel.findOne({ _id: rideId, status: "pending" });
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }
        if (!ride.passengers.includes(passengerId)) {
            return res.status(400).json({ error: 'Passenger is not in this ride' });
        }

        const updatedRide = await rideModel.findOneAndUpdate(
            { _id: rideId },
            { $pull: { passengers: passengerId }, $inc: { availableSeats: 1 } },
            { new: true }
        );

        if (!updatedRide) {
            return res.status(400).json({ error: 'Failed to remove passenger. Please try again.' });
        }

        const notificationMessage = `You have been removed from the ride from ${ride.from} to ${ride.to} by the driver.`;
        await User.findByIdAndUpdate(
            passengerId,
            { $push: { messages: { message: notificationMessage, read: false } } }
        );

        const io = getIoInstance();
        io.emit('increaseSeat', rideId);

        return res.status(200).json({
            message: "Passenger removed successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing the passenger' });
    }
}

module.exports.completeRide = async (req, res, next) => {
    const { rideId } = req.body;
    const userId = req.user.id;
    
    try {
        const ride = await rideModel.findOne({ _id: rideId, driver: userId, status: "progress" });

        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }
        ride.status = "completed";
        await ride.save();

        return res.status(200).json({
            message: "Ride completed successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while completing the ride' });
    }
}

cron.schedule('0 * * * * *', async () => {
    const nowUtc = new Date(); // Current UTC time

    try {
        await rideModel.updateMany(
            { status: 'pending', datetime: { $lte: nowUtc } },
            { $set: { status: 'progress' } }
        );

        await rideModel.updateMany(
            { status: 'progress', leaveDateTime: { $lte: nowUtc } },
            { $set: { status: 'completed' } }
        );

    } catch (err) {
        console.error('Error updating ride statuses:', err.message);
    }
});
