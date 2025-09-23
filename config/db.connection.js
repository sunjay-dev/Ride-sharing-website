const mongoose = require('mongoose');

module.exports = async function connectToMongoDB(url) {
    return mongoose.connect(url);
}