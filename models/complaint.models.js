const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: function() { return !this.user; },
        trim: true
    },
    email: {
        type: String,
        required: function() { return !this.user; },
        trim: true,
        lowercase: true,
    }
},{ timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;