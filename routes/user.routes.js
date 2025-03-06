const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { upload } = require('../utils/multer.utils.js');
const { restrictToUserlogin, restrictToLoginedUser, restrictToCorrectResetLink } = require('../middlewares/auth.middleware.js');
const passport = require("../config/MSauth.services.js");

router.get('/', restrictToLoginedUser, (req, res) => {
    res.render('index.ejs');
});

router.get('/login', restrictToLoginedUser, (req, res) => {
    res.render('login.ejs');
});

router.get("/auth/microsoft", restrictToLoginedUser, passport.authenticate("azure_ad_oauth2", { prompt: "select_account"}));

router.get(['/register', '/signup'], restrictToLoginedUser, (req, res) => {
    res.render('register.ejs',{
        error: null
    });
});

router.get('/forget-password', restrictToLoginedUser, (req, res) => {
    res.render('forget-password.ejs');
});

router.get("/reset-password/:token", restrictToCorrectResetLink, (req, res) => {
    const { token } = req.params;
    res.render("reset-password", { token, email:req.user.email });
});
router.get('/home', restrictToUserlogin, (req, res) => {
    res.render('home.ejs');
});
router.get('/find_Ride', restrictToUserlogin, (req, res) => {
    res.render('findRide.ejs');
});
router.get('/offer_Ride', restrictToUserlogin, (req, res) => {
    res.render('createRide.ejs');
});
router.get('/inbox', (req, res) => {
    res.render('inbox.ejs');
});

router.get('/profile', restrictToUserlogin, (req, res) => {
    res.render('profile.ejs');
});

router.get("/auth/microsoft/callback", restrictToLoginedUser, userController.microsoftAuthCallback);
router.get('/logout', userController.logout);

router.post('/register',upload.single('img') , userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/homePage', restrictToUserlogin,userController.homePageDetails);

router.post('/inbox', restrictToUserlogin,userController.sendAllMessages);

router.post('/forget-password', userController.forgetPassword);

router.post('/profile', restrictToUserlogin, userController.showProfile);

router.post('/getUserRideStats', restrictToUserlogin, userController.getUserRideStats);

router.post('/resetPassword', userController.resetPassword);

module.exports = router;