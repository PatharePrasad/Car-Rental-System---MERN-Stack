import jwt from "jsonwebtoken";
import { ENV } from "../config/index.js";
import { UserModel } from "../models/index.js";

const verifyAccess = async (req, res, next) => {
    try {
        const token = req.cookies.AT;
        if (!token) return res.sendStatus(401);
        const tokenData = jwt.verify(token, ENV.ACCESS_TOKEN);
        const hasId = Object.hasOwn(tokenData, "id");
        const hasIrt = Object.hasOwn(tokenData, "irt");
        if (!hasId || !hasIrt) return res.sendStatus(401);
        const user = await UserModel.findById(tokenData.id, { refreshToken: 1 });
        if (!user || tokenData.irt !== user.refreshToken) return res.sendStatus(401);
        // console.log(!user, tokenData.irt !== user.refreshToken);
        // console.log("t", !user || tokenData.irt !== user.refreshToken);
        req.body.id = tokenData.id;
        next();
    } catch (err) {
        console.error(err);
        if (err.name === "TokenExpiredError") return res.sendStatus(401);
        return res.status(200).send({ message: "Something went wrong!!" });
    }
};

const Interceptors = { verifyAccess };
export default Interceptors;
