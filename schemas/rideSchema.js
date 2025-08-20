const { z } = require("zod");
const { ObjectId } = require("mongodb");

const createRideSchema = z.object({
    from: z.string().trim().min(1, "Starting point is required"),
    to: z.string().trim().min(1, "Destination is required"),
    datetime: z.string()
        .refine((val) => {
            const date = new Date(val);
            return !isNaN(date) && date > new Date();
        }, { message: "The selected time must be in the future" }),
    fare: z.number()
        .min(0, "Fare cannot be less than 0")
        .max(150, "Fare cannot exceed 150"),
    seats: z.number()
        .int("Seats must be an integer")
        .min(1, "Seats cannot be less than 1")
        .max(4, "Seats cannot exceed 4"),
    vehicleDetails: z.string().refine((val) => ObjectId.isValid(val), {
        message: "Please provide valid vehicle Details",
    }),
});
const rideIdSchema = z.object({
    rideId: z.string().refine((val) => ObjectId.isValid(val), {
        message: "Please provide valid rideId",
    }),
});
const removePassengerSchema = z.object({
    rideId: z.string().refine((val) => ObjectId.isValid(val), {
        message: "Please provide valid rideId",
    }),
    passengerId: z.string().refine((val) => ObjectId.isValid(val), {
        message: "Please provide valid passengerId",
    }),
});


module.exports = { createRideSchema, rideIdSchema, removePassengerSchema };
