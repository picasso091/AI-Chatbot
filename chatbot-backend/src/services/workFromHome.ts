import fs from "fs";

import { ApiError } from "../classes/ApiError";
import { IJSONData, IWFHData } from "../interfaces/data.interface";

export const fetchDailyWFHDetails = async (dates: string[], countries: string[]): Promise<IWFHData[]> => {
    return new Promise((resolve, reject) => {
        try {
            const data: any = fs.readFileSync(process.cwd() + "/src/data/data.json");
            const jsonData: IJSONData = JSON.parse(data);
            let wfhData = jsonData.workFromHome;
            if (countries.length > 0) {
                wfhData = wfhData.filter((el) => countries.includes(el.country));
            }
            resolve(wfhData);
        } catch (err: any) {
            console.log(err);
            reject(new ApiError("Failed to fetch work from home data", 400));
        }
    });
};
