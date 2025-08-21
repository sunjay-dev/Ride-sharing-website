const { getUser } = require('../services/auth.services.js');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models.js');

async function restrictToUserlogin(req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.redirect('/login');

    const user = getUser(token);
    if (!user) return res.redirect('/login');

    req.user = user;
    next();
}

async function restrictToLoginedUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) next();
    const user = getUser(token);
    if (user)
        return res.redirect('/home');
}
// async function restrictToGuests(req,res,next) {

//     if(req.cookies.token)
//     return res.redirect('/');

//     next();
// }

// async function restrictToUserloginForComplaints(req,res,next) {
//     const token = req.cookies.token;
//     if(!req.cookies.token){
//         return res.render("nonLogincomplaints.ejs")
//     }

//     next();
// }

async function restrictToCorrectResetLink(req, res, next) {
    const { token } = req.params; // Extract token

    if (!token || token.split(".").length !== 3) {
        return res.status(404).redirect('/404')
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId) {
            return res.status(404).redirect('/404')
        }
        //authenticate if link does exist in user record
        const user = await userModel.findOne({_id: decoded.userId, resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return res.status(404).redirect('/404')
        }

        req.user = { email: user.email };
        next(); 
    } catch {
       return res.status(404).redirect('/404')
    }
}

module.exports = { restrictToUserlogin, restrictToLoginedUser, restrictToCorrectResetLink };