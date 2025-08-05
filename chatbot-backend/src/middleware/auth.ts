import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestHandler } from "express";

import User from "../models/User.model";
import { ApiError } from "../classes/ApiError";
import { JWT_SECRET } from "../config/constants";

export const protect: RequestHandler = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(new ApiError("Not authorized", 401));
        }

        const decoded = (await jwt.verify(token, JWT_SECRET)) as JwtPayload;
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(new ApiError("Not authorized", 401));
        }

        req.user = currentUser;
        next();
    } catch (err) {
        next(new ApiError("Authentication error. JWT verification failed", 401));
    }
};
