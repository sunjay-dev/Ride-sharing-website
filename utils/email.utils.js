function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@students\.muet\.edu\.pk$/; 
    return emailRegex.test(email);
  }

  function ismyValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

  module.exports = { isValidEmail, ismyValidEmail };