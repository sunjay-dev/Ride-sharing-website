const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const { restrictToUserlogin } = require('../middlewares/auth.middleware.js');

router.get('/created', (req, res) => {
    res.render('rideSuccess.ejs');
});
router.get('/joined', (req, res) => {
    res.render('rideJoinedSuccess.ejs');
});

router.get('/history', restrictToUserlogin, (req, res) => {
    res.render('rideHistory.ejs');
});



router.post('/', restrictToUserlogin,  rideController.createRide);
router.post('/confirmRide', restrictToUserlogin,  rideController.joinRide);
router.post('/getCurrentRide', restrictToUserlogin,  rideController.getCurrentRide);
router.post('/getHomePageRides', restrictToUserlogin,  rideController.getHomePageRides);
router.post('/cancelBooking', restrictToUserlogin,  rideController.cancelBooking);
router.post('/cancelRide', restrictToUserlogin,  rideController.cancelRide);
router.post('/removePassenger', restrictToUserlogin,  rideController.removePassenger);
router.post('/completeRide', restrictToUserlogin,  rideController.completeRide);

router.post('/history', restrictToUserlogin, rideController.getAsaDriverRide)
router.post('/history/passenger', restrictToUserlogin, rideController.getAsaPassengerRide)
router.post('/history/getRideById', restrictToUserlogin, rideController.getRideByIdHistory)



module.exports = router;