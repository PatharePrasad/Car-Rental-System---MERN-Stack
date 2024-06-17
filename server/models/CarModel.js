import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        seats: {
            type: Number,
            required: true,
        },
        rent: {
            type: Number,
            required: true,
        },
        fuel: {
            type: String,
            enum: ["petrol", "diesel"],
            required: true,
        },

        bookingDetails: {
            bookedFrom: {
                type: Date,
            },
            bookedTill: {
                type: Date,
            },
            paymentId: {
                type: String,
            },
        },
    },
    { timestamps: true }
);

const CarModel = mongoose.model("Car", CarSchema);
export default CarModel;
