const userModel = require('../models/user.models.js');
const { isValidEmail } = require('../utils/email.utils.js');
const { uploadImageToCloudinary } = require('../utils/cloudinary.utils.js');
const { setUser, getUser } = require('../services/auth.services.js');

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