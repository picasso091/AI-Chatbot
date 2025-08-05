import fs from "fs";

import { ApiError } from "../classes/ApiError";
import { IJSONData, IPublicHolidaysData, IFloatingHolidaysData } from "../interfaces/data.interface";

export const fetchPublicHolidays = (countries: string[]): Promise<IPublicHolidaysData[]> => {
    return new Promise((resolve, reject) => {
        try {
            const data: any = fs.readFileSync(process.cwd() + "/src/data/data.json");
            const jsonData: IJSONData = JSON.parse(data);
            let holidaysData = jsonData.upcomingPublicHolidays;

            if (countries.length > 0) {
                holidaysData = holidaysData.filter((el) => countries.includes(el.country));
            } else {
                holidaysData = holidaysData.filter((el) => el.country === "Nepal");
            }
            resolve(holidaysData);
        } catch (err) {
            console.log(err);
            reject(new ApiError("Failed to fetch public holidays", 400));
        }
    });
};

export const fetchMyFloatingHolidays = (): Promise<IFloatingHolidaysData[]> => {
    return new Promise((resolve, reject) => {
        try {
            const data: any = fs.readFileSync(process.cwd() + "/src/data/data.json");
            const jsonData: IJSONData = JSON.parse(data);
            resolve(jsonData.myFloatingHolidays);
        } catch (err) {
            reject(new ApiError("Faile to fetch floating holidays", 400));
        }
    });
};
