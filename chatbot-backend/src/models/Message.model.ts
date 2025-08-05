import { Schema, Model, model } from "mongoose";

import { IMessage } from "../interfaces/message.interface";

type MessageModel = Model<IMessage>;

const messageSchema = new Schema<IMessage, MessageModel>(
    {
        type: {
            type: String,
            enum: [
                "DEFAULT",
                "WORK_FROM_HOME",
                "LEAVE",
                "EMPLOYEE_INFO",
                "PUBLIC_HOLIDAYS",
                "MEETING_ROOM_INFO",
                "LEAVE_BALANCE",
                "MY_FLOATING_HOLIDAYS",
                "MY_LEAVE_INFO",
                "EMPLOYEE_BIRTHDAYS",
                "MY_INFO",
                "NEW_SR",
                "SIMILAR_EMP_NAMES"
            ],
            default: "DEFAULT",
            required: true
        },
        fromBot: {
            type: Boolean,
            default: false,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String
        },
        content: {
            type: Object
        }
    },
    { timestamps: true }
);

const Message = model<IMessage, MessageModel>("Message", messageSchema);

export default Message;
