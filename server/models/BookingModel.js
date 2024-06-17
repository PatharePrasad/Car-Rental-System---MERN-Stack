import mongoose, { Schema } from "mongoose";

const BookingSchema = new mongoose.Schema({
    carId: {
        type: Schema.Types.ObjectId,
        ref: "Cars",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    from: {
        type: Date,
    },
    to: {
        type: Date,
    },
    paymentId: {
        type: String,
    },
    status: {
        type: String,
        default: "pending",
        enum: ["completed", "pending", "failed", "canceled"],
    },
});

const BookingModel = mongoose.model("Bookings", BookingSchema);
export default BookingModel;
