const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_Secret;

function setUser(id, email) {
    return jwt.sign({
        id, email
    }, secret)
}

function getUser(token) {
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        return null;
    }
}

module.exports = { setUser, getUser }