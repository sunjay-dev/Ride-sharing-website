const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { upload } = require('../utils/multer.utils.js');
const { restrictToUserlogin, restrictToLoginedUser } = require('../middlewares/auth.middleware.js');

router.get('/', restrictToLoginedUser, (req, res) => {
    res.render('index.ejs');
});

router.get('/login', restrictToLoginedUser, (req, res) => {
    res.render('login.ejs');
});

router.get(['/register', '/signup'], restrictToLoginedUser, (req, res) => {
    res.render('register.ejs',{
        error: null
    });
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

router.get('/logout', userController.logout);

router.post('/register',upload.single('img') , userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/homePage', restrictToUserlogin,userController.homePageDetails);

router.post('/inbox', restrictToUserlogin,userController.sendAllMessages);

router.post('/profile', restrictToUserlogin, userController.showProfile);

router.post('/getUserRideStats', restrictToUserlogin, userController.getUserRideStats);

module.exports = router;