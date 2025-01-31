const { getUser } = require('../services/auth.services.js');

async function restrictToUserlogin(req,res,next) {
    const token = req.cookies.token;

    if(!token) return res.redirect('/login');

    const user = getUser(token);
    if(!user) return res.redirect('/login');

    req.user=user;
    next();
}

async function restrictToLoginedUser(req,res,next) {
    const token = req.cookies.token;
    if(!token) next();
    const user = getUser(token);
    if(user)
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


module.exports = {restrictToUserlogin, restrictToLoginedUser};