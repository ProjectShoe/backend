const bcrypt = require("bcrypt");
const { MESSAGE } = require("../utils/constants");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const User = db.user;
let refreshTokens = [];

//register
exports.register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: "ERR",
        message: MESSAGE.REQUEST_BODY_IS_MISSING,
      });
    }

    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: "ERR",
        message: MESSAGE.THE_INPUT_IS_REQUIRED,
      });
    }

    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!isCheckEmail) {
      return res.status(404).json({
        status: "ERR",
        message: MESSAGE.THE_INPUT_IS_EMAIL,
      });
    }

    if (password != confirmPassword) {
      return res.status(404).json({
        status: "ERR",
        message: MESSAGE.THE_PASSWORD_IS_EQUAL,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "ERR",
        message: MESSAGE.EMAIL_ALREADY_EXISTS,
      });
    } else {
      const newUser = await User.create({
        username,
        email,
        password: hashPassword,
      });
      res.status(200).json({
        status: "OK",
        message: "Register successfully!",
        data: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Register failed",
      error: error.message,
    });
  }
};

//generateAccessToken
exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "7d" }
  );
};

//generateRefreshToken
exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

//refreshToken
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: "ERR",
        message: "You're not authenticated",
      });
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      const newAccessToken = exports.generateAccessToken(user);
      const newRefreshToken = exports.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "RefreshToken failed",
      error: error.message,
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: "ERR",
        message: MESSAGE.REQUEST_BODY_IS_MISSING,
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "ERR",
        message: MESSAGE.THE_INPUT_IS_REQUIRED,
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        status: "ERR",
        message: "Wrong Email",
      });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return res.status(404).json({
        status: "ERR",
        message: "Wrong Password",
      });
    }

    if (existingUser && validPassword) {
      //Generate access token
      const accessToken = exports.generateAccessToken(existingUser);
      //Generate refresh token
      const refreshToken = exports.generateRefreshToken(existingUser);
      //STORE REFRESH TOKEN IN COOKIE
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json({
        status: "OK",
        message: "Login successfully!",
        data: existingUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

//logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({
      status: "OK",
      message: "Logout successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
};
