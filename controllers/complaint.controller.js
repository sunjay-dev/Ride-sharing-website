const complaintModel = require('../models/complaint.models.js');

module.exports.registerComplaint = async (req, res, next) => {
    const {subject, description, email, name} = req.body;
    try {
        await complaintModel.create({
            subject,
            description,
            name,
            email
        });

        return res.status(200).json({
            message: "Submitted successfully."
        });
    } catch (error) {
        console.error("Error creating complaint:", error);
        return res.status(500).json({
            message: "An error occurred while submitting your complaint. Please try again later."
        });
    }
}