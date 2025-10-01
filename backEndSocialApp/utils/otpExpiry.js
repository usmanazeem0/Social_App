module.exports = function otpExpiry(minutes = 3) {
  return Date.now() + minutes * 60 * 1000;
};
