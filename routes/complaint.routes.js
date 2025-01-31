const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');

router.get('/',  (req, res) => {
    res.render('help.ejs');
});


router.post('/', complaintController.registerComplaint );

module.exports = router;