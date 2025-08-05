import { Types, HydratedDocument } from "mongoose";

export interface IMessage {
    type: string;
    fromBot: boolean;
    user: Types.ObjectId;
    message?: string;
    content?: any;
}

export type IHydratedMessage = HydratedDocument<IMessage>;
