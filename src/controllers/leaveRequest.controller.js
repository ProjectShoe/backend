const db = require("../models/index");

const LeaveRequest = db.leaveRequest;
const User = require("../models/user.model");

exports.addLeaveRequest = async (req, res) => {
    try {
        const { startDate, endDate, reason, userId } = req.body;

        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ status: "ERR", message: "All fields are required" });
        }

        const newLeaveRequest = await LeaveRequest.create({
            user: userId || req.user.id,
            startDate,
            endDate,
            reason,
        });

        res.status(200).json({ status: "OK", message: "Leave request submitted successfully", data: newLeaveRequest });
    } catch (error) {
        res.status(500).json({ status: "ERR", message: "Failed to submit leave request", error: error.message });
    }
};

exports.updateLeaveRequest = async (req, res) => {
    try {
        const { status, approver, comments } = req.body;

        const leaveRequest = await LeaveRequest.findById(req.params.id);
        if (!leaveRequest) {
            return res.status(404).json({ status: "ERR", message: "Leave request not found" });
        }

        leaveRequest.status = status || leaveRequest.status;
        leaveRequest.approver = approver || leaveRequest.approver;
        leaveRequest.comments = comments || leaveRequest.comments;

        await leaveRequest.save();

        res.status(200).json({ status: "OK", message: "Leave request updated successfully", data: leaveRequest });
    } catch (error) {
        res.status(500).json({ status: "ERR", message: "Failed to update leave request", error: error.message });
    }
};

exports.getLeaveRequestsByUser = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find({ user: req.user.id }).populate("user", "username email");

        res.status(200).json({ status: "OK", message: "Leave requests fetched successfully", data: leaveRequests });
    } catch (error) {
        res.status(500).json({ status: "ERR", message: "Failed to fetch leave requests", error: error.message });
    }
};

exports.getAllLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find().populate("user", "username email").populate("approver", "name email");

        res.status(200).json({ status: "OK", message: "All leave requests fetched successfully", data: leaveRequests });
    } catch (error) {
        res.status(500).json({ status: "ERR", message: "Failed to fetch leave requests", error: error.message });
    }
};
