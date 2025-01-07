const { MESSAGE } = require("../utils/constants");
const db = require("../models/index");
const Timecard = db.timecards;

exports.addTimecard = async (req, res) => {
    try {
        const { userId, checkinAt, status, note } = req.body;

        if (!userId || !checkinAt) {
            return res.status(400).json({
                status: "ERR",
                message: MESSAGE.THE_INPUT_IS_REQUIRED,
            });
        }

        const startOfDay = new Date(checkinAt);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(checkinAt);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const existingTimecard = await Timecard.findOne({
            userId,
            status: "checked-in",
            checkinAt: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });
        if (existingTimecard) {
            existingTimecard.checkoutAt = checkinAt;
            existingTimecard.status = 'checked-out';

            const updatedTimecard = await existingTimecard.save();
            return res.status(200).json({
                status: "OK",
                message: "Checkout successfully!",
                data: updatedTimecard,
            });
        }
        const checkoutAt = '';
        const newTimecard = await Timecard.create({
            userId,
            checkinAt,
            checkoutAt: checkoutAt || null,
            status: status || "checked-in",
            note: note || "",
        });

        return res.status(200).json({
            status: "OK",
            message: "Checkin successfully!",
            data: newTimecard,
        });
    } catch (error) {
        return res.status(500).json({
            message: "AddTimecard failed",
            error: error.message,
        });
    }
};

// Cập nhật thông tin chấm công (ví dụ: checkoutAt, status)
exports.updateTimecard = async (req, res) => {
    try {
        const { checkoutAt, status, note } = req.body;

        // Tìm chấm công theo ID
        const timecard = await Timecard.findById(req.params.id);

        if (!timecard) {
            return res.status(404).json({
                status: "ERR",
                message: "Timecard not found",
            });
        }

        // Cập nhật các trường thông tin nếu có
        timecard.checkoutAt = checkoutAt || timecard.checkoutAt;
        timecard.status = status || timecard.status;
        timecard.note = note || timecard.note;

        // Lưu lại chấm công đã cập nhật
        const updatedTimecard = await timecard.save();

        return res.status(200).json({
            status: "OK",
            message: "Update timecard successfully",
            data: updatedTimecard,
        });
    } catch (error) {
        return res.status(500).json({
            message: "UpdateTimecard failed",
            error: error.message,
        });
    }
};

// Xóa chấm công
exports.deleteTimecard = async (req, res) => {
    try {
        const deletedTimecard = await Timecard.findByIdAndDelete(req.params.id);

        if (!deletedTimecard) {
            return res.status(404).json({
                status: "ERR",
                message: "Timecard not found",
            });
        }

        return res.status(200).json({
            status: "OK",
            message: "Delete timecard successfully",
            data: deletedTimecard,
        });
    } catch (error) {
        return res.status(500).json({
            message: "DeleteTimecard failed",
            error: error.message,
        });
    }
};

// Lấy thông tin chấm công theo ID
exports.getTimecard = async (req, res) => {
    try {
        const timecard = await Timecard.findById(req.params.id);

        if (!timecard) {
            return res.status(404).json({
                status: "ERR",
                message: "Timecard not found",
            });
        }

        return res.status(200).json({
            status: "OK",
            message: "Get timecard successfully",
            data: timecard,
        });
    } catch (error) {
        return res.status(500).json({
            message: "GetTimecard failed",
            error: error.message,
        });
    }
};

exports.getAllTimecards = async (req, res) => {
    try {
        const timecards = await Timecard.find().populate("userId", "username email image");

        // if (!timecards || timecards.length === 0) {
        //     return res.status(404).json({
        //         status: "ERR",
        //         message: "No timecards found",
        //     });
        // }

        return res.status(200).json({
            status: "OK",
            message: "Get all timecards successfully",
            data: timecards,
        });
    } catch (error) {
        return res.status(500).json({
            message: "GetAllTimecards failed",
            error: error.message,
        });
    }
};
