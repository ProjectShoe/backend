const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // code: { type: String, trim: true, unique: true },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 6 },
    code: { type: String, required: true },
    image: { type: String, required: false },
    bankCode: { type: String, required: true },
    phone: { type: String, trim: true, unique: true },
    Address: { type: String, trim: true, require: true },
    startTime: { type: Date },
    endTime: { type: Date },
    isAdmin: { type: Boolean, default: false, require: true },
    isActive: { type: Boolean, require: true, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
