# Ride Sharing Website

## 📌 Overview
This is a ride-sharing platform designed to help MUET students conveniently find and offer rides, reducing travel costs and promoting eco-friendly commuting. Users can create ride offers, search for available rides, manage their trips, and receive real-time updates.

## 🚀 Features
- **User Authentication**: Secure login and signup system.
- **Offer a Ride**: Drivers can create ride offers.
- **Find a Ride**: Passengers can search for available rides.
- **Manage Rides**: Users can oversee their current rides.
- **Ride History**: Log of all created, joined, and canceled rides.
- **Notifications**: Alerts for ride cancellations or when a passenger leaves.
- **Real-time Updates**: Live seat availability and ride notifications using WebSockets.
- **Forgot Password**: Users can reset passwords via email link.

## 🛠 Tech Stack
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) 
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![EJS](https://img.shields.io/badge/ejs-%23B4CA65.svg?style=for-the-badge&logo=ejs&logoColor=black) 
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) 
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101) 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) 
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) 
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) 
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) 
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white) 
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) 
![GitLab](https://img.shields.io/badge/gitlab-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white) 
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white) 
![Canva](https://img.shields.io/badge/Canva-%2300C4CC.svg?style=for-the-badge&logo=Canva&logoColor=white)


- **Frontend**: EJS (Embedded JavaScript Templates) + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Token)
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Real-time Updates**: WebSockets


## 🔧 Installation
1. Clone the repository:
   ```bash
   https://github.com/sunjay-dev/Ride-sharing-website
   cd Ride-sharing-website
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file (see below).
4. Run the server:
   ```bash
   npm start
   ```
The app will be running at `http://localhost:3000`

## Environment Variables
Create a `.env` file in the root directory and add the following:
```env
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/database_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
PORT=3000
```


## 🔑 User Authentication
- **Sign Up** with university email (`@students.muet.edu.pk`).
- **Login** to access ride-sharing features.
- **Forgot Password?** Reset using an emailed link.

## 🚀 What's Next?
- Develop a mobile app for iOS & Android.
- Add a feature for drivers to approve passengers before joining a ride.

## 🤝 Contributors
- **Varoon Kumar** - UI Designer
- **Sunjay Kumar** - MERN Stack Developer (Backend Focused)
- **Muhammad Sajid** - MERN Stack Developer (Frontend Focused)

## 🎯 Support Us
If you like our project, please support us by contributing open source! 🙌
