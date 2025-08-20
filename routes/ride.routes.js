const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const { restrictToUserlogin } = require('../middlewares/auth.middleware.js');
const { validate } = require('../middlewares/validate.middlewares.js');
const { createRideSchema, rideIdSchema, removePassengerSchema} = require('../schemas/rideSchema.js')


router.get('/created', (req, res) => {
    res.render('rideSuccess.ejs');
});
router.get('/joined', (req, res) => {
    res.render('rideJoinedSuccess.ejs');
});

router.get('/history', restrictToUserlogin, (req, res) => {
    res.render('rideHistory.ejs');
});

router.post('/', restrictToUserlogin, validate(createRideSchema), rideController.createRide);
router.post('/confirmRide', restrictToUserlogin, validate(rideIdSchema) , rideController.joinRide);
router.post('/getCurrentRide', restrictToUserlogin,  rideController.getCurrentRide);
router.post('/getHomePageRides', restrictToUserlogin,  rideController.getHomePageRides);
router.post('/cancelBooking', restrictToUserlogin, validate(rideIdSchema) ,rideController.cancelBooking);
router.post('/cancelRide', restrictToUserlogin, validate(rideIdSchema),rideController.cancelRide);
router.post('/removePassenger', restrictToUserlogin, validate(removePassengerSchema) , rideController.removePassenger);
router.post('/completeRide', restrictToUserlogin,  validate(rideIdSchema), rideController.completeRide);

router.post('/history', restrictToUserlogin, rideController.getAsaDriverRide)
router.post('/history/passenger', restrictToUserlogin, rideController.getAsaPassengerRide)
router.post('/history/getRideById', restrictToUserlogin, validate(rideIdSchema), rideController.getRideByIdHistory)



module.exports = router;