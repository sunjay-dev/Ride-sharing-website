const express = require('express');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const connectToMongoDB = require('./config/db.connection.js');
const app = express();
const session = require('express-session'); 
const passport = require('passport'); 

connectToMongoDB(process.env.mongoURI).then(()=>{
    console.log('Mongoose connected!')
})

app.use(
    session({
        secret: process.env.SESSION_SECRET || "mysecret", // Use a strong secret
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Change to `true` in production with HTTPS
    })
);

// ✅ Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session()); // Enables persistent login sessions

const vehicleRoutes = require('./routes/vehicle.routes.js');
const userRoutes = require('./routes/user.routes.js');
const complaintRoutes = require('./routes/complaint.routes.js');
const rideRoutes = require('./routes/ride.routes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use('/', userRoutes);
app.use('/vehicle',vehicleRoutes);
app.use('/ride',rideRoutes);
app.use('/help',complaintRoutes);

app.use(express.static(path.join(__dirname, "public"), { 
    setHeaders: (res, path) => {
        res.status(200);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
}));

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

module.exports = app;