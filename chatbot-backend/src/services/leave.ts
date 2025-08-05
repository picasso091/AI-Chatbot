import fs from "fs";

import { ApiError } from "../classes/ApiError";
import { IJSONData, ILeaveData, IMyLeaveBalance, IMyLeaveInfo } from "../interfaces/data.interface";

export const fetchDailyLeaveDetails = async (dates: string[], countries: string[]): Promise<ILeaveData[]> => {
    return new Promise((resolve, reject) => {
        try {
            const data: any = fs.readFileSync(process.cwd() + "/src/data/data.json");
            const jsonData: IJSONData = JSON.parse(data);
            let leaveData = jsonData.leave;
            if (countries.length > 0) {
                leaveData = leaveData.filter((el) => countries.includes(el.country));
            }
            resolve(leaveData);
        } catch (err) {
            console.log(err);
            reject(new ApiError("Failed to fetch leave data", 400));
        }
    });
};

export const fetchMyLeaveBalance = async (): Promise<IMyLeaveBalance[]> => {
    return new Promise((resolve, reject) => {
        try {
            const data: any = fs.readFileSync(process.cwd() + "/src/data/data.json");
            const jsonData: IJSONData = JSON.parse(data);
            resolve(jsonData.myLeaveBalance);
        } catch (err) {
            console.log(err);
            reject(new ApiError("Failed to fetch leave balance data", 400));
        }
    });
};

export const fetchMyLeaveInfo = async (): Promise<IMyLeaveInfo[]> => {
    return new Promise((resolve, reject) => {
        try {
            const data: any = fs.readFileSync(process.cwd() + "/src/data/data.json");
            const jsonData: IJSONData = JSON.parse(data);
            resolve(jsonData.myLeaveInfo);
        } catch (err) {
            console.log(err);
            reject(new ApiError("Failed to fetch your leave information", 400));
        }
    });
};
