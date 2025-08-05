import { Types } from "mongoose";
import { RequestHandler } from "express";

import { ApiError } from "../classes/ApiError";
import { getMessages, saveMessage } from "./message.controller";

export const createServiceRequest: RequestHandler = async (req, res, next) => {
    try {
        const newSr = {
            ...req.body,
            _id: new Types.ObjectId(),
            createdBy: req.user?.fullName
        };
        const botMessage = "Created a new SR with the following details";
        await saveMessage(req, botMessage, true, "NEW_SR", newSr);
        const userMessages = await getMessages(req.user?._id);
        res.status(200).json({
            success: true,
            message: "SR created",
            userMessages
        });
    } catch (err) {
        next(new ApiError("Cannot create a SR right now", 400));
    }
};
