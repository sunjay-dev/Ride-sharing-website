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
   git clone https://github.com/your-repo.git
   cd your-project
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
