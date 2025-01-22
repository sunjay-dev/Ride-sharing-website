function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@muet\.edu\.pk$/; 
    return emailRegex.test(email);
  }
  
  module.exports = { isValidEmail };