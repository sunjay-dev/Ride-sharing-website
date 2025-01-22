const { getUser } = require('../services/auth.services.js');

async function restrictToUserlogin(req,res,next) {
    const uid = req.cookies.uid;

    if(!uid) return res.redirect('/user/login');

    const user = getUser(uid);
    if(!user) return res.redirect('/user/login');

    req.user=user;
    next();
}

// async function restrictToUserVerification(req,res,next) {
//     const uid = req.cookies.uid;
//     const user = getUser(uid);
//     if(user.verified=="false")
//     return res.render('emailverify.ejs', { email: user.email })
    
//     req.user=user;
//     next();
// }
async function restrictToGuests(req,res,next) {
    
    if(req.cookies.uid)
    return res.redirect('/');
    
    next();
}

module.exports = {restrictToUserlogin, restrictToGuests};