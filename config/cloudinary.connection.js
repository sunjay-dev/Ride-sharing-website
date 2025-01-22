const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.Cloudinary_cloud_name, 
  api_key: process.env.Cloudinary_api_key,
  api_secret: process.env.Cloudinary_api_secret
});

module.exports =  cloudinary ;