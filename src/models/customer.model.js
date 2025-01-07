const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Tên khách hàng
        email: { type: String, required: true, unique: true }, // Email khách hàng
        phone: { type: String, required: true }, // Số điện thoại
        address: { type: String, required: true }, // Địa chỉ khách hàng
        isActive: { type: Boolean, default: true }, // Trạng thái hoạt động của khách hàng
    },
    {
        timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
    }
);

module.exports = mongoose.model("Customer", customerSchema);
