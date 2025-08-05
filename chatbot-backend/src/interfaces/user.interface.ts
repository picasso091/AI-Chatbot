import { HydratedDocument } from "mongoose";

export interface ILoginBody {
    userName: string;
    password: string;
}

export interface IJWTPayload {
    userName: string;
    id: string;
    fullName: string;
    profile?: string;
}

export interface IUser {
    userName: string;
    userId: number;
    fullName: string;
    firstName: string | "";
    dateOfBirth: string | "";
    dateOfJoin: string | "";
    designation: string | "";
    department: string | "";
    departmentCode: string | "";
    country: string | "";
    supervisor: string | "";
    supervisorCode: number | "";
    address: string | "";
    mobileNumber: string | "";
    phoneNumber: string | "";
    gender: string | "";
    status: string | "";
    permanent: boolean | "";
    permanentDate: string | "";
    email: string | "";
    profile: string | "";
}

export type IHydratedUser = HydratedDocument<IUser>;
