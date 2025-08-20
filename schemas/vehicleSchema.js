const { z } = require("zod");

const registerVehicleSchema = z.object({
  vehicleType: z.enum(["car", "bike"]),
  numberPlate: z.string()
    .trim()
    .min(1, "Number plate is required")
    .regex(/^[A-Z0-9-\s]+$/i, "Invalid number plate"),
  color: z.string()
    .trim()
    .min(1, "Color is required")
    .regex(/^[a-zA-Z\s-]+$/, "Invalid color"),
  model: z.string()
    .trim()
    .min(1, "Model is required")
    .regex(/^[a-zA-Z0-9\s.-]+$/, "Invalid model"),
});

const deleteVehicleSchema = z.object({
  numberPlate: z.string()
    .trim()
    .min(1, "Number plate is required")
    .regex(/^[A-Z0-9-\s]+$/i, "Invalid number plate"),
});

module.exports = { registerVehicleSchema, deleteVehicleSchema };
