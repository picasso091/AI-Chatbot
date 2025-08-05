import axios from "axios";
import mongoose from "mongoose";

import User from "../models/User.model";

// const MONGODB_URL = "mongodb://10.0.3.144:27017,10.0.3.145:27017,10.0.3.146:27017/?replicaSet=JAVRA-MongoCluster";
// const DB_NAME = "javra-chatbot";
// const DB_USER = "root";
// const DB_PASS = "Xs4m0ng0db";

import { DB_NAME, DB_PASS, DB_USER, HRM_BASE_URL, HRM_EMPLOYEE_API_URL, MONGODB_URL, USER_DATA_API_URL} from "../config/constants";

const mapUserData = async (user: any) => {
    let response;
    try {
        response = await axios.get(`${HRM_EMPLOYEE_API_URL}/${user.EmployeeID}`);
        const userImage = response?.data?.profile?.personal_details?.profile?.profile250x250;
        const newData = {
            userName: user.Username,
            userId: user.EmployeeID,
            status: user.Status,
            supervisorCode: user.SupervisorCode,
            permanent: user.Permanent,
            permanentDate: user.Permanentdate,
            fullName: user.FullName,
            firstName: user.FirstName,
            dateOfJoin: user.Begindate,
            dateOfBirth: user.BirthDate,
            designation: user.Designation,
            departmentCode: user.DepartmentCode,
            department: user.Department,
            gender: user.Gender,
            supervisor: user.SupervisorID,
            country: user.Country,
            mobileNumber: user.Mobile,
            phoneNumber: user.Phone,
            email: user.Email,
            address: user.Address,
            profile: userImage ? `${HRM_BASE_URL}${userImage}` : null
        };
        return newData;
    } catch (err: any) {
        if (err.response && err.response.status == 404 && !err.response.data.success) {
            const newData = {
                userName: user.Username,
                userId: user.EmployeeID,
                status: user.Status,
                supervisorCode: user.SupervisorCode,
                permanent: user.Permanent,
                permanentDate: user.Permanentdate,
                fullName: user.FullName,
                firstName: user.FirstName,
                dateOfJoin: user.Begindate,
                dateOfBirth: user.BirthDate,
                designation: user.Designation,
                departmentCode: user.DepartmentCode,
                department: user.Department,
                gender: user.Gender,
                supervisor: user.SupervisorID,
                country: user.Country,
                mobileNumber: user.Mobile,
                phoneNumber: user.Phone,
                email: user.Email,
                address: user.Address
            };
            return newData;
        } else {
            console.log(err);
            throw err;
        }
    }
};

const createUser = async (user: any) => {
    console.log(`Importing data for ${user.Username}`);
    try {
        const existingUser = await User.findOne({ userId: user.EmployeeID });
        if (existingUser) {
            const updatedData = await mapUserData(user);
            await User.findOneAndUpdate({ userId: user.EmployeeID }, updatedData);
        } else {
            const mappedData = await mapUserData(user);
            const newUser = new User(mappedData);
            await newUser.save();
        }
    } catch (err) {
        throw err;
    }
};

const createOrUpdateUsers = async () => {
    try {
        console.log("<----------User import started----------->");
        const response = await axios.get(USER_DATA_API_URL);
        if (response?.data?.UserInfo?.length) {
            const userDataArray = response.data.UserInfo;
            for (const user of userDataArray) {
                await createUser(user);
            }
        } else {
            console.log("User data not found");
        }
        console.log("<----------User import completed----------->");
    } catch (err) {
        console.log("Issue during user import");
        console.log(err);
    }
};

mongoose
    .connect(MONGODB_URL, {
        dbName: DB_NAME,
        user: DB_USER,
        pass: DB_PASS
    })
    .then(() => {
        createOrUpdateUsers();
    })
    .catch((err) => {
        console.log("Database connection failed");
        console.log(err);
    });
