const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Liên kết với User
        startDate: { type: Date, required: true }, // Ngày bắt đầu nghỉ
        endDate: { type: Date, required: false }, // Ngày kết thúc nghỉ
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }, // Trạng thái duyệt
        reason: { type: String, required: true }, // Lý do xin nghỉ
        approver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Người duyệt
        comments: { type: String, default: "" }, // Ghi chú của người duyệt
    },
    {
        timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
    }
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
