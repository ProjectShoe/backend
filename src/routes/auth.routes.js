const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
//Đăng kí
router.post("/register", authController.register);
//Đăng nhập
router.post("/signin", authController.login);
//Đăng xuất
router.post("/logout", authController.logout);
//RefreshToken
router.post("/refreshToken", authController.refreshToken);

module.exports = router;
