import axios from "axios";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";

import { ApiError } from "../classes/ApiError";
import User from "../models/User.model";
import { ILoginBody, IJWTPayload } from "../interfaces/user.interface";
import { JWT_SECRET, XEPST_EMPLOYEE_LOGIN } from "../config/constants";

export const userLogin: RequestHandler = async (req, res, next) => {
    try {
        const userData: ILoginBody = {
            userName: req.body.userName,
            password: req.body.password
        };
        const user = await User.findOne({ userName: userData.userName, status: "ACT" });
        if (!user) {
            return next(new ApiError("Wrong username or password", 401));
        }

        const lmsResponse = await axios.get(
            `${XEPST_EMPLOYEE_LOGIN}&userid=${userData.userName}&password=${userData.password}`
        );
        if (!(lmsResponse.data?.Login[0]?.Status === "success")) {
            return next(new ApiError("Wrong username or password", 401));
        }

        const payload: IJWTPayload = {
            userName: user.userName,
            id: user._id.toString(),
            fullName: user.fullName,
            profile: user.profile
        };
        const accessToken = jwt.sign(payload, JWT_SECRET);

        res.status(200).json({
            success: true,
            message: "Login Successful",
            data: {
                accessToken: accessToken
            }
        });
    } catch (error: any) {
        const errorMessage = error.message || "Login error";
        next(new ApiError(errorMessage, 401));
    }
};
