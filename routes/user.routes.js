const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { upload } = require('../utils/multer.utils.js') 

router.get('/', (req, res) => {
    res.render('index.ejs');
});

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.get(['/register', '/signup'], (req, res) => {
    res.render('register.ejs');
});

router.post('/register',upload.single('img') , userController.registerUser);

// router.post('/login', userController.loginUser);

module.exports = router;