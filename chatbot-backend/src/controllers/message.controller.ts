import { Request, RequestHandler } from "express";
import { Types } from "mongoose";

import Message from "../models/Message.model";
import { MESSAGE_FETCH_LIMIT } from "../config/constants";

export const saveMessage = async (
    req: Request,
    message: string,
    fromBot: boolean = false,
    contentType?: string,
    additionalContent?: any
) => {
    const userId = req.user?._id;

    try {
        let newMessage = new Message({
            fromBot,
            message,
            user: userId
        });

        switch (contentType) {
            case "EMPLOYEE_INFO":
            case "WORK_FROM_HOME":
            case "LEAVE":
            case "PUBLIC_HOLIDAYS":
            case "MEETING_ROOM_INFO":
            case "LEAVE_BALANCE":
            case "MY_FLOATING_HOLIDAYS":
            case "MY_LEAVE_INFO":
            case "EMPLOYEE_BIRTHDAYS":
            case "MY_INFO":
            case "NEW_SR":
            case "SIMILAR_EMP_NAMES":
                newMessage.type = contentType;
                newMessage.content = {
                    data: additionalContent
                };
                break;
            default:
                break;
        }
        await newMessage.save();
        return newMessage;
    } catch (err) {
        throw err;
    }
};

export const getMessages = async (userId: string | Types.ObjectId | undefined, page: number = 1) => {
    try {
        const skipCount = (page - 1) * MESSAGE_FETCH_LIMIT;
        const messages = await Message.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skipCount)
            .limit(MESSAGE_FETCH_LIMIT)
            .exec();
        messages.reverse();
        return messages;
    } catch (err) {
        throw err;
    }
};

export const fetchUserMessages: RequestHandler = async (req, res) => {
    try {
        const userId = req.user?._id;
        let page = 1;
        if (req.query.page && typeof req.query.page === "string") {
            page = parseInt(req.query.page);
        }
        const userMessages = await getMessages(userId, page);
        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            userMessages
        });
    } catch (err) {
        throw err;
    }
};
