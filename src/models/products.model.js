const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: false }, // Thêm trường image
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
  },
  {
    timestamps: true,
  }
);

// Middleware to exclude deleted documents by default
productSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

productSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

productSchema.pre("findById", function () {
  this.where({ isDeleted: false });
});

// Override `deleteOne` for soft delete
productSchema.statics.softDelete = async function (filter) {
  return this.updateOne(filter, { isDeleted: true });
};

// Override `findByIdAndDelete` for soft delete
productSchema.statics.findByIdAndSoftDelete = async function (id) {
  return this.findByIdAndUpdate(id, { isDeleted: true });
};

// Export the model
module.exports = mongoose.model("Product", productSchema);
