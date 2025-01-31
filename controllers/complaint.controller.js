const complaintModel = require('../models/complaint.models.js');
const {ismyValidEmail} = require('../utils/email.utils.js');


module.exports.registerComplaint = async (req, res, next) => {
    const {subject, description, email, name} = req.body;

    if(!subject || !description || !email || !name){
        return res.status(400).json({
            error: "All fields are required"
        })
    }
    if(!ismyValidEmail(email)){
        return res.status(400).json({
            error: "Please enter a valid email"
        })
    }
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
            error: "An error occurred while submitting your complaint. Please try again later."
        });
    }
}