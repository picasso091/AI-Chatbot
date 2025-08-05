import fs from "fs";
import { HydratedDocument } from "mongoose";

import User from "../models/User.model";
import { ApiError } from "../classes/ApiError";
import { IHydratedUser } from "../interfaces/user.interface";
import { IJSONData, IUpcomingBirthdays } from "../interfaces/data.interface";
import { checkStringSimilarity } from "../utils/stringSimilarity";

interface IUserNames {
    fullName: string;
    firstName: string;
}

interface IEmployeeInfoQuery {
    $or: {
        fullName: {
            $regex: RegExp;
        };
        status: string;
    }[];
}

export const fetchEmployeeInfo = (query: IEmployeeInfoQuery): Promise<IHydratedUser[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await User.find(query);
            resolve(users);
        } catch (err) {
            console.log(err);
            reject(new ApiError("Failed to fetch employee information", 400));
        }
    });
};

export const fetchUpcomingEmployeeBirthdays = (countries: string[]): Promise<IUpcomingBirthdays[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const data: any = fs.readFileSync(process.cwd() + "/src/data/data.json");
            const jsonData: IJSONData = JSON.parse(data);
            let birthdaysData = jsonData.upcomingBirthdays;
            if (countries.length > 0) {
                birthdaysData = birthdaysData.filter((el) => countries.includes(el.country));
            }
            resolve(birthdaysData);
        } catch (err) {
            console.log(err);
            reject(new ApiError("Failed to fetch employee birthdays", 400));
        }
    });
};

export const findSimilarEmployees = (inputName: string): Promise<HydratedDocument<IUserNames>[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await User.find({ status: "ACT" }).select("fullName firstName");
            console.log("INPUT = ", inputName);
            if (inputName.split(" ").length === 1) {
                users = users.filter(
                    (user) => checkStringSimilarity(user.firstName.toLowerCase(), inputName.toLowerCase()) >= 0.5
                );
            } else {
                users = users.filter(
                    (user) => checkStringSimilarity(user.fullName.toLowerCase(), inputName.toLowerCase()) >= 0.4
                );
            }

            resolve(users);
        } catch (err) {
            console.log(err);
            reject(new ApiError("Failed to find similar employees", 400));
        }
    });
};
