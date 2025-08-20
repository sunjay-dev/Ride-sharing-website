const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller.js');
const { restrictToUserlogin } = require('../middlewares/auth.middleware.js');
const { validate } = require('../middlewares/validate.middlewares.js');
const {registerVehicleSchema, deleteVehicleSchema} = require('../schemas/vehicleSchema.js')

router.get('/manageVehicles', restrictToUserlogin, (req, res) => {
    res.render('manageVehicle.ejs', {
        error: null
    });
});

router.post('/register', restrictToUserlogin, validate(registerVehicleSchema),vehicleController.register);
router.get('/getVehicles', restrictToUserlogin,vehicleController.getVehicles);
router.put('/deleteVehicles', restrictToUserlogin,validate(deleteVehicleSchema),vehicleController.deleteVehicles);

module.exports = router;