import { RequestHandler } from "express";

import { findIntentFromText } from "../utils/intent";
import { findDatesFromEntity, filterPastDates, findCountriesFromEntity } from "../utils/entity";
import { getMessages, saveMessage } from "../controllers/message.controller";
import { fetchDailyWFHDetails } from "../services/workFromHome";
import { fetchDailyLeaveDetails, fetchMyLeaveBalance, fetchMyLeaveInfo } from "../services/leave";
import { fetchEmployeeInfo, fetchUpcomingEmployeeBirthdays, findSimilarEmployees } from "../services/employee";
import { fetchMyFloatingHolidays, fetchPublicHolidays } from "../services/holiday";
import { fetchMeetingRoomInfo } from "../services/meeting";
import { ApiError } from "../classes/ApiError";
import {
    APPLY_LEAVE,
    APPLY_WORK_FROM_HOME,
    FETCH_DAILY_LEAVE_DATA,
    FETCH_DAILY_WFH_DATA,
    FETCH_EMPLOYEE_INFO,
    FETCH_MY_FLOATING_HOLIDAYS,
    FETCH_MY_LEAVE_BALANCE,
    FETCH_MY_LEAVE_INFO,
    FETCH_UPCOMING_HOLIDAYS,
    MEETING_ROOM_INFO,
    FETCH_UPCOMING_BIRTHDAYS,
    FETCH_MY_INFO,
    CREATE_SR
} from "../config/intents";

export const actWithIntent: RequestHandler = async (req, res, next) => {
    try {
        const userInput: string = req.body.userInput;
        if (!userInput) {
            return res.status(400).json({
                success: false,
                message: "User input text is required"
            });
        }

        await saveMessage(req, userInput);
        const intentResponse = await findIntentFromText(userInput);
        const topIntent: string = intentResponse.prediction.topIntent;
        const entities = intentResponse.prediction.entities;
        let message: string = "";
        console.log("Top Intent = ", topIntent);

        if (topIntent === APPLY_WORK_FROM_HOME) {
            const wfhEntity = entities.find((el: any) => el.category === "WorkFromHome");
            if (wfhEntity) {
                const dateEntity = entities.filter((el: any) => el.category === "Date");
                const tempDates = findDatesFromEntity(dateEntity);
                const dates = filterPastDates(tempDates);
                if (dates.length > 0) {
                    message = `Work from home applied on ${dates.join(", ")}`;
                    await saveMessage(req, message, true);
                } else {
                    message = "Date is needed to apply for work from home";
                    await saveMessage(req, message, true);
                }
            } else {
                message = "Sorry, I am unable to understand your request";
                await saveMessage(req, message, true);
            }
        } else if (topIntent === APPLY_LEAVE) {
            const leaveTypeEntity = entities.find((el: any) => el.category === "LeaveType");
            if (leaveTypeEntity) {
                const dateEntity = entities.filter((el: any) => el.category === "Date");
                const tempDates = findDatesFromEntity(dateEntity);
                const dates = filterPastDates(tempDates);
                if (dates.length > 0) {
                    message = `Leave applied on ${dates.join(", ")}`;
                    await saveMessage(req, message, true);
                } else {
                    message = "Date is needed to apply for leave";
                    await saveMessage(req, message, true);
                }
            } else {
                message = "Sorry, you need to specify the leave type";
                await saveMessage(req, message, true);
            }
        } else if (topIntent === FETCH_DAILY_WFH_DATA) {
            const dateEntity = entities.filter((el: any) => el.category === "Date");
            const countryEntity = entities.filter((el: any) => el.category === "Country");
            const dates = findDatesFromEntity(dateEntity);
            const countries = findCountriesFromEntity(countryEntity);
            if (dates.length === 0) {
                dates.push(new Date().toDateString());
            }
            const wfhList = await fetchDailyWFHDetails(dates, countries);
            message = `Here are the list of people for work from home on ${dates.join(", ")}`;
            await saveMessage(req, message, true, "WORK_FROM_HOME", wfhList);
        } else if (topIntent === FETCH_DAILY_LEAVE_DATA) {
            const dateEntity = entities.filter((el: any) => el.category === "Date");
            const countryEntity = entities.filter((el: any) => el.category === "Country");
            const dates = findDatesFromEntity(dateEntity);
            const countries = findCountriesFromEntity(countryEntity);
            if (dates.length === 0) {
                dates.push(new Date().toDateString());
            }
            const leaveList = await fetchDailyLeaveDetails(dates, countries);
            message = `Here are the list of people on leave on ${dates.join(", ")}`;
            await saveMessage(req, message, true, "LEAVE", leaveList);
        } else if (topIntent === FETCH_EMPLOYEE_INFO) {
            const employeeEntity = entities.filter((el: any) => el.category === "EmployeeName");
            const employeeNames: string[] = [];
            employeeEntity.forEach((el: any) => el.text.length >= 3 && employeeNames.push(el.text));
            if (employeeNames.length > 0) {
                const regexArray = employeeNames.map((name: any) => ({
                    fullName: { $regex: new RegExp(name, "i") },
                    status: "ACT"
                }));
                const query = { $or: regexArray };
                const employeeList = await fetchEmployeeInfo(query);
                if (employeeList.length === 0) {
                    if (employeeNames.length === 1) {
                        const similarUsers = await findSimilarEmployees(employeeNames[0]);
                        message =
                            similarUsers.length === 0
                                ? "No employee found with given name."
                                : "No employee found. Here are some similar employee names:";
                        await saveMessage(req, message, true, "SIMILAR_EMP_NAMES", similarUsers);
                    } else {
                        message = "No employee found with given name.";
                        await saveMessage(req, message, true);
                    }
                } else {
                    if (employeeList.length === 1) {
                        message = `Here is the information of ${employeeList[0].firstName}`;
                    } else {
                        message = "Here is the information of the employee you wanted";
                    }
                    await saveMessage(req, message, true, "EMPLOYEE_INFO", employeeList);
                }
            } else {
                message = "No employee found with given name";
                await saveMessage(req, message, true);
            }
        } else if (topIntent === MEETING_ROOM_INFO) {
            const meetingData = await fetchMeetingRoomInfo();
            message = "Here is the meeting room info you requested";
            await saveMessage(req, message, true, "MEETING_ROOM_INFO", meetingData);
        } else if (topIntent === FETCH_MY_LEAVE_BALANCE) {
            const myLeaveBalance = await fetchMyLeaveBalance();
            message = "Here is your leave balance";
            await saveMessage(req, message, true, "LEAVE_BALANCE", myLeaveBalance);
        } else if (topIntent === FETCH_MY_LEAVE_INFO) {
            const leaveInfo = await fetchMyLeaveInfo();
            message = "Here is your leave information";
            await saveMessage(req, message, true, "MY_LEAVE_INFO", leaveInfo);
        } else if (topIntent === FETCH_UPCOMING_HOLIDAYS) {
            const countryEntity = entities.filter((el: any) => el.category === "Country");
            const countries = findCountriesFromEntity(countryEntity);
            const holidayList = await fetchPublicHolidays(countries);
            message = "Here are the public holidays";
            if (countries.length === 1) {
                message = `Here are the public holidays for ${countries[0]}`;
            }
            await saveMessage(req, message, true, "PUBLIC_HOLIDAYS", holidayList);
        } else if (topIntent === FETCH_MY_FLOATING_HOLIDAYS) {
            const floatingHolidays = await fetchMyFloatingHolidays();
            message = "Here are your floating holidays";
            await saveMessage(req, message, true, "MY_FLOATING_HOLIDAYS", floatingHolidays);
        } else if (topIntent === FETCH_UPCOMING_BIRTHDAYS) {
            const countryEntity = entities.filter((el: any) => el.category === "Country");
            const countries = findCountriesFromEntity(countryEntity);
            const upcomingBirthdays = await fetchUpcomingEmployeeBirthdays(countries);
            message = "Here are the closest employee birthdays";
            if (countries.length === 1) {
                message = `Here are the closest employee birthdays for ${countries[0]}`;
            }
            await saveMessage(req, message, true, "EMPLOYEE_BIRTHDAYS", upcomingBirthdays);
        } else if (topIntent === FETCH_MY_INFO) {
            const myInfo = req.user;
            message = "Here is your information";
            await saveMessage(req, message, true, "MY_INFO", myInfo);
        } else if (topIntent === CREATE_SR) {
            message = "Please provide me with the details of the new SR";
            await saveMessage(req, message, true);
        } else {
            message = "Sorry, I am unable to understand your request";
            await saveMessage(req, message, true);
        }
        const userMessages = await getMessages(req.user?._id);
        res.status(200).json({
            success: true,
            message,
            userMessages,
            intent: topIntent
        });
    } catch (err) {
        console.log(err);
        next(new ApiError("Intent recognition failed", 400));
    }
};
