const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: false,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: { type: Boolean, require: true },

}, {
  timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
});

module.exports = mongoose.model("Order", OrderSchema);
