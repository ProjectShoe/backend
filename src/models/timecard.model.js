const mongoose = require("mongoose");

const timecardSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        checkinAt: {
            type: Date,
            required: true,
        },
        checkoutAt: {
            type: Date,
            default: null,
        },
        hoursWorked: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["checked-in", "checked-out", "absent"],
            default: "checked-in",
        },
        note: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);


timecardSchema.pre("save", function (next) {
    if (this.checkoutAt) {
        this.status = "checked-out"
        const diffInMilliseconds = this.checkoutAt - this.checkinAt;
        this.hoursWorked = diffInMilliseconds / (1000 * 60 * 60);
    }
    next();
});

timecardSchema.pre("updateOne", function (next) {
    if (this.checkoutAt) {
        this.status = "checked-out"
        const diffInMilliseconds = this.checkoutAt - this.checkinAt;
        this.hoursWorked = diffInMilliseconds / (1000 * 60 * 60);
    }
    next();
});

module.exports = mongoose.model("Timecard", timecardSchema);
