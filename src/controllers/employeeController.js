const { MESSAGE } = require("../utils/constants");
const db = require("../models/index");
const User = db.user;
const bcrypt = require("bcrypt");

exports.addUser = async (req, res) => {
  try {
    const { email, username, password, phone, address, isActive = true, code, bankCode } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Đường dẫn ảnh

    if (!email || !username || !password || !phone || !address || !code || !bankCode) {
      return res.status(400).json({
        status: "ERR",
        message: MESSAGE.THE_INPUT_IS_REQUIRED,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email, phone });

    if (existingUser) {
      return res.status(400).json({
        status: "ERR",
        message: "User đã tồn tại",
      });
    } else {
      const newUser = await User.create({
        email,
        username,
        password: hashPassword,
        phone,
        Address: address,
        isActive,
        code,
        bankCode,
        image
      });
      res.status(200).json({
        status: "OK",
        message: "AddUser successfully!",
        data: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "CreateUser failed",
      error: error.message,
    });
  }
};

exports.UpdateUser = async (req, res) => {
  try {
    const { username, password, phone, address, code, bankCode, endTime, isActive, startTime } = req.body;
    const user = await User.findById(req.params.id);
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || user.image; // Đường dẫn ảnh
    // if (phone) {
    //   const phoneUser = await User.findOne({ phone });
    //   if (phoneUser && phoneUser._id.toString() !== req.params.id) {
    //     return res.status(400).json({
    //       status: "ERR",
    //       message: "Phone already exists",
    //     });
    //   }
    // }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...user._doc,
        username,
        password: password ? await bcrypt.hash(password, 10) : user.password,
        phone,
        Address: address,
        code,
        bankCode,
        image,
        isActive,
        endTime,
        startTime: startTime ? new Date(startTime).toISOString() : user._doc.startTime,
      },
      { new: true, runValidators: true }
    );

    if (!updateUser) {
      return res.status(400).json({
        status: "ERR",
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        status: "OK",
        message: "Update user successfully",
        data: updateUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);

    if (!deleteUser) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "OK",
      message: "Delete User successfully",
      data: deleteUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "DeleteUser failed",
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);

    if (!getUser) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "OK",
      message: "GetUser successfully",
      data: getUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "GetUser failed",
      error: error.message,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const getAllUser = await User.find();

    if (!getAllUser) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "OK",
      message: "GetAllUser successfully",
      data: getAllUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "GetAllUser failed",
      error: error.message,
    });
  }
};

exports.getTotalAllUser = async (req, res) => {
  try {
    const countUser = await User.countDocuments({ isAdmin: false });
    res.status(200).json({
      status: "OK",
      message: "GetTotalAllUser successfully",
      data: countUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "GetAllUser failed",
      error: error.message,
    });
  }
};

exports.getTotalStatusUser = async (req, res) => {
  try {
    const countUser = await User.countDocuments({
      isAdmin: false,
      isActive: true,
    });
    res.status(200).json({
      status: "OK",
      message: "GetTotalStatusUser successfully",
      data: countUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "GetTotalStatusUser failed",
      error: error.message,
    });
  }
};
exports.getTotalUnStatusUser = async (req, res) => {
  try {
    const countUser = await User.countDocuments({
      isAdmin: false,
      isActive: false,
    });
    res.status(200).json({
      status: "OK",
      message: "GetTotalUnStatusUser successfully",
      data: countUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "GetTotalUnStatusUser failed",
      error: error.message,
    });
  }
};

exports.getTotalNewUser = async (req, res) => {
  try {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    const newEmployeeCount = await User.countDocuments({
      createdAt: {
        $gte: oneMonthAgo,
      },
      isAdmin: { $ne: true },
    });

    res.json({
      data: newEmployeeCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "GetTotalNewUser failed",
      error: error.message,
    });
  }
};
