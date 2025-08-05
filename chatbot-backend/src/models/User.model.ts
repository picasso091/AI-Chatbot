import { Schema, Model, model } from "mongoose";

import { IUser } from "../interfaces/user.interface";

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser, UserModel>(
    {
        userName: {
            type: String,
            required: true
        },
        userId: {
            type: Number,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        firstName: {
            type: String
        },
        dateOfBirth: {
            type: String
        },
        dateOfJoin: {
            type: String
        },
        designation: {
            type: String
        },
        department: {
            type: String
        },
        departmentCode: {
            type: String
        },
        country: {
            type: String
        },
        supervisor: {
            type: String
        },
        supervisorCode: {
            type: Number
        },
        address: {
            type: String
        },
        mobileNumber: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        gender: {
            type: String,
        },
        status: {
            type: String
        },
        permanent: {
            type: Boolean
        },
        permanentDate: {
            type: String
        },
        email: {
            type: String
        },
        profile: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const User = model<IUser, UserModel>("User", userSchema);

export default User;
