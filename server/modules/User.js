import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import { ENV } from "../config/index.js";
import { UserModel } from "../models/index.js";

const getDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const [user] = await UserModel.aggregate([
            { $match: { _id: mongoose.Types.ObjectId.createFromHexString(id) } },
            { $lookup: { from: "bookings", localField: "_id", foreignField: "userId", as: "bookingDetails" } },
            {
                $unwind: {
                    path: "$bookingDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $lookup: { from: "cars", localField: "bookingDetails.carId", foreignField: "_id", as: "carDetails" } },
            {
                $unwind: {
                    path: "$carDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    imgSrc: { $first: "$image" },
                    email: { $first: "$email" },
                    bookingDetails: {
                        $push: {
                            bookingId: { $toString: "$bookingDetails._id" },
                            carId: { $toString: "$bookingDetails.carId" },
                            from: "$bookingDetails.from",
                            to: "$bookingDetails.to",
                            status: { $ifNull: ["$bookingDetails.status", "pending"] },
                            carName: "$carDetails.name",
                            carRent: "$carDetails.rent",
                        },
                    },
                },
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    imgSrc: 1,
                    bookingDetails: 1,
                },
            },
        ]);
        if (user.bookingDetails.length < 2 && user.bookingDetails[0].bookingId === null) user.bookingDetails = [];
        console.log(user);
        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(200).send({ message: "Something went wrong!!" });
    }
};

// const

const updateUser = async (req, res) => {
    try {
        const { updateData, id } = req.body;
        if (updateData?.password === "") delete updateData.password;
        if (updateData.password) {
            const hashedPassword = await bcryptjs.hash(updateData.password, parseInt(ENV.PASSWORD_SALT));
            updateData.password = hashedPassword;
        }
        await UserModel.findByIdAndUpdate(id, updateData);
        res.status(200).send({ message: "User updated successfully!", next: "home" });
    } catch (err) {
        console.error(err);
        res.status(200).send({ message: "Something went wrong!!" });
    }
};

export default { getDetails, updateUser };
