const userModel = require('../models/user.models.js');
const { isValidEmail } = require('../utils/email.utils.js');
const { uploadImageToCloudinary } = require('../utils/cloudinary.utils.js');

module.exports.registerUser = async (req, res, next) => {

    const { firstName, lastName, email, password, phone } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Image is required' });
    }

    if (!isValidEmail) {
        return res.status(400).json({ message: 'Email must be a valid @muet.edu.pk email' });
    }

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }
    // const hashedPassword = await userModel.hashPassword(password);

    // let secure_url = await uploadImageToCloudinary(req.file.buffer);

    const [hashedPassword, secure_url] = await Promise.all([
        userModel.hashPassword(password),
        uploadImageToCloudinary(req.file.buffer),
      ]);

    await userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        img: secure_url
      });

      res.send("user successfull");
}
