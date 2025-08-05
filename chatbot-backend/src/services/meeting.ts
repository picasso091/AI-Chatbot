import axios from "axios";

import { ApiError } from "../classes/ApiError";
import { IMeetingRoomInfo } from "../interfaces/data.interface";

interface IFormattedData {
    organizer: string;
    tag: string;
    start: string;
    end: string;
    subject: string;
    roomId: number;
    location: string;
}

export const fetchMeetingRoomInfo = async (): Promise<{ [key: string]: IFormattedData[] }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get("https://meeting.javra.com/api/events");
            const meetingData: IMeetingRoomInfo[] = response.data.data;

            const formattedData: {
                [key: string]: IFormattedData[];
            } = {};
            for (let el of meetingData) {
                if (Object.keys(formattedData).includes(el.location)) {
                    formattedData[el.location].push({
                        organizer: el.organizer,
                        tag: el.tag,
                        start: el.start,
                        end: el.end,
                        subject: el.subject,
                        roomId: el.roomId,
                        location: el.location
                    });
                } else {
                    formattedData[el.location] = [
                        {
                            organizer: el.organizer,
                            tag: el.tag,
                            start: el.start,
                            end: el.end,
                            subject: el.subject,
                            roomId: el.roomId,
                            location: el.location
                        }
                    ];
                }
            }
            resolve(formattedData);
        } catch (err) {
            console.log(err);
            reject(new ApiError("Failed to fetch meeting room data", 400));
        }
    });
};
