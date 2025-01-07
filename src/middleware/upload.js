const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Thư mục lưu ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Tên file duy nhất
    },
});

const upload = multer({ storage });

module.exports = upload;
