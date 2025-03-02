const userModel = require('../models/user.models.js');
const rideModel = require('../models/ride.models.js');
const { isValidEmail } = require('../utils/email.utils.js');
const { uploadImageToCloudinary } = require('../utils/cloudinary.utils.js');
const { setUser, getUser } = require('../services/auth.services.js');
const { sendemail } = require('../services/emailsend.js');
const jwt = require('jsonwebtoken');

module.exports.registerUser = async (req, res, next) => {

    const { firstName, lastName, email, password, phone, department } = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !department) {
        return res.render("register.ejs", {
            error: "Please provide all Information"
        });
    }

    if (!req.file) {
        return res.render("register.ejs", {
            error: "Image is required"
        });
    }

    if (!isValidEmail(email)) {
        return res.render("register.ejs", {
            error: "Email must be a valid @students.muet.edu.pk email"
        });
    }

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.render("register.ejs", {
            error: "User already exist"
        });
    }

    const [hashedPassword, secure_url] = await Promise.all([
        userModel.hashPassword(password),
        uploadImageToCloudinary(req.file.buffer)
    ]);

    const newUser = await userModel.create({
        firstName,
        lastName,
        email,
        department,
        password: hashedPassword,
        phone,
        img: secure_url
    });

    const token = setUser(newUser._id);

    res.cookie('token', token);
    return res.redirect('/home');
}


module.exports.loginUser = async (req, res, next) => {
    const { email: rawEmail, password } = req.body;
    email = rawEmail.toLowerCase();
    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).json({
            error: "Invalid email or password"
        })
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(400).json({
            error: "Invalid email or password"
        })
    }

    const token = setUser(user._id);

    res.cookie('token', token);
    return res.status(200).json({
        message: "Login Success"
    })
}

module.exports.logout = async (req, res, next) => {
    res.clearCookie('token');
    res.redirect('/login');
}

module.exports.showProfile = async (req, res, next) => {
    const user = await userModel.findOne({ _id: req.user.id });
    if (!user) return res.status(201).json({
        message: "No user found"
    })
    return res.status(200).json({
        user
    })
}

module.exports.homePageDetails = async (req, res, next) => {
    const user = await userModel.findOne({ _id: req.user.id });

    if (!user) return res.status(201).json({
        message: "No user found"
    });

    const unreadMessagesCount = user.countUnreadMessages();

    return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        img: user.img,
        unreadMessagesCount
    });
}

module.exports.sendAllMessages = async (req, res, next) => {
    const user = await userModel.findOne({ _id: req.user.id });

    if (!user) return res.status(201).json({
        message: "No user found"
    });

    const messages = user.messages;

    res.status(200).json({
        messages
    });

    await user.markAllMessagesAsRead();
}

module.exports.forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(404).json({
        message: "No User Found."
    });

    if (user.resetTokenExpiry && user.resetTokenExpiry > Date.now()) {
        return res.status(429).json({ message: "You can request a reset link only once per hour." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Create reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    sendemail(resetLink, email, user.firstName, user.lastName);

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    return res.status(200).json({
        message: "Email sent to reset password"
    });
}

module.exports.resetPassword = async (req, res, next) => {

    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({
        message: "Token and password are required"
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded.userId });

        if (!user) return res.status(404).json({
            message: "No User Found."
        });

        const hashedPassword = await userModel.hashPassword(password);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined
        await user.save();

        const Token_cookie = setUser(user._id);
        res.cookie('token', Token_cookie);

        return res.status(200).json({
            message: "Password reset successfully"
        });
    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token"
        });
    }
}


module.exports.getUserRideStats = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const [ridesCreated, ridesCompleted, ridesCanceled] = await Promise.all([
            rideModel.countDocuments({ driver: userId }),
            rideModel.countDocuments({ driver: userId, status: "completed" }),
            rideModel.countDocuments({ driver: userId, status: "canceled" })
        ]);

        res.status(200).json({ ridesCreated, ridesCompleted, ridesCanceled });
    } catch (error) {
        console.error("Error fetching ride stats:", error);
        return { ridesCreated: 0, ridesCompleted: 0, ridesCanceled: 0 };
    }
};
