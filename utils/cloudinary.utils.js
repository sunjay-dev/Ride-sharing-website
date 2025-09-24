const cloudinary = require('../config/cloudinary.connection.js');

 async function uploadImageToCloudinary(imageBuffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'Carpooling', quality: 'auto', fetch_format: 'auto' },
      (error, result) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(imageBuffer);
  });
}

module.exports = { uploadImageToCloudinary };