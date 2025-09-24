const userModel = require('../models/user.models.js');
const rideModel = require('../models/ride.models.js');
const { uploadImageToCloudinary }  = require('../utils/cloudinary.utils.js');
const { setUser } = require('../services/auth.services.js');
const { sendemail } = require('../services/emailsend.js');
const jwt = require('jsonwebtoken');
const passport = require("../config/MSauth.services.js");
const { registerSchema } = require('../schemas/userSchema.js')
const { ZodError } = require("zod");

module.exports.registerUser = async (req, res, next) => {
    try {
        const parsedData = registerSchema.parse(req.body);

        if (!req.file) {
            return res.render("register.ejs", { error: "Image is required" });
        }

        const isUserAlready = await userModel.findOne({ email: parsedData.email });
        if (isUserAlready) {
            return res.render("register.ejs", { error: "User already exists" });
        }

        const [hashedPassword, secureUrl] = await Promise.all([
            userModel.hashPassword(parsedData.password),
            uploadImageToCloudinary(req.file.buffer),
        ]);

        const newUser = await userModel.create({
            ...parsedData,
            password: hashedPassword,
            img: secureUrl,
        });

        const token = setUser(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.redirect("/home");
    } catch (error) {
        if (error instanceof ZodError) {
            const isDefaultError = error.issues[0].message.startsWith("Invalid input");
            const message = isDefaultError ? `${error.issues[0].path}: ${error.issues[0].message}` : error.issues[0].message;
            return res.render("register.ejs", { error: message });
        }
        
        res.render("register.ejs", { error: "Something went wrong. Please try again later." });
    }
};


module.exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
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

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login Success"
        })

    } catch (error) {
        console.error("Error while login:", error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

module.exports.logout = async (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.clearCookie('token');
    res.redirect('/login');
}

module.exports.showProfile = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ _id: req.user.id });
        if (!user) return res.status(201).json({
            message: "No user found"
        })
        return res.status(200).json({
            user
        })
    } catch (error) {
        console.error("Error while showing user profile:", error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

module.exports.homePageDetails = async (req, res, next) => {
    try {
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
    } catch (error) {
        console.error("Error while fetching home page details:", error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

module.exports.sendAllMessages = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ _id: req.user.id });

        if (!user) return res.status(201).json({
            message: "No user found"
        });

        const messages = user.messages;

        res.status(200).json({
            messages
        });

        await user.markAllMessagesAsRead();
    } catch (error) {
        console.error("Error while sending all messages:", error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

module.exports.forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
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

        await sendemail(resetLink, email, user.firstName, user.lastName);

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000;
        await user.save();

        return res.status(200).json({
            message: "Email sent to reset password"
        });
    } catch (error) {
        return res.status(404).json({
            message: "Error sending email",
            error: error
        });
    }
}

module.exports.resetPassword = async (req, res, next) => {

    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded.userId });

        if (!user) return res.status(404).json({
            message: "No User Found."
        });

        const hashedPassword = await userModel.hashPassword(password);
        user.password = hashedPassword;
        user.resetToken = undefined;
        // user.resetTokenExpiry = undefined
        await user.save();

        const Token_cookie = setUser(user._id);
        res.cookie('token', Token_cookie, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

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

module.exports.microsoftAuthCallback = async (req, res, next) => {
    passport.authenticate("azure_ad_oauth2", (err, user, info) => {
        if (err) {
            console.error("Auth error:", err);
            return res.redirect(`/login?error=${encodeURIComponent("Internal server error")}`);
        }
        if (!user) {
            let errorMessage = "Unauthorized";
            if (info && info.message) errorMessage = info.message;
            return res.redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
        }

        res.cookie("token", setUser(user._id), {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect("/home");
    })(req, res, next);
}