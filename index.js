const express = require('express');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const connectToMongoDB = require('./config/db.connection.js');
const app = express();

connectToMongoDB(process.env.mongoUri).then(()=>{
    console.log('Mongoose connected!')
})

// const rideRoutes = require('./routes/ride');
const userRoutes = require('./routes/user.routes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use('/', userRoutes);
// app.use('/ride',urlRoutes);

app.use(express.static(path.join(__dirname, "public"), { 
    setHeaders: (res, path) => {
        res.status(200);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
}));

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Running on port : ${port}`)
})