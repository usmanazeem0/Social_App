const multer = require("multer");
const path = require("path");

//storage configration

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // folder to save images
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

//file filter decides which file to accept

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
