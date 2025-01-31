const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_Secret;

function setUser(id) {
    return jwt.sign({
        id, 
    }, secret, { expiresIn: '30d' })
}

function getUser(token) {
    try {
    return jwt.verify(token, secret)
    } catch (error) {
        return null;
    }
}

module.exports = { setUser, getUser }