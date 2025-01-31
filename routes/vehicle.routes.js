const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller.js');
const { restrictToUserlogin } = require('../middlewares/auth.middleware.js');

router.get('/manageVehicles', restrictToUserlogin, (req, res) => {
    res.render('manageVehicle.ejs', {
        error: null
    });
});

router.post('/register', restrictToUserlogin,vehicleController.register);
router.post('/getVehicles', restrictToUserlogin,vehicleController.getVehicles);
router.put('/deleteVehicles', restrictToUserlogin,vehicleController.deleteVehicles);

module.exports = router;