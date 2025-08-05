export interface IWFHData {
    fullName: string;
    department: string;
    country: string;
}

export interface ILeaveData {
    fullName: string;
    department: string;
    country: string;
    reportingDate: string;
}

export interface IPublicHolidaysData {
    description: string;
    date: string;
    day: string;
    country: string;
}

export interface IFloatingHolidaysData {}

export interface IMyFloatingHolidaysData {
    description: string;
    date: string;
    day: string;
    status: string;
}

export interface IMyLeaveBalance {
    leaveType: number;
    totalBalance: number;
    usedBalance: number;
    remainingBalance: number;
}

export interface IMyLeaveInfo {
    appliedOn: string;
    duration: string;
    days: number;
    leaveType: string;
    status: string;
}

export interface IUpcomingBirthdays {
    fullName: string;
    date: string;
    department: string;
    country: string;
}

export interface IMeetingRoomInfo {
    subject: string;
    start: string;
    end: string;
    location: string;
    organizer: string;
    roomId: number;
    tag: string;
}

export interface IJSONData {
    workFromHome: IWFHData[];
    leave: ILeaveData[];
    upcomingPublicHolidays: IPublicHolidaysData[];
    upcomingFloatingHolidays: IFloatingHolidaysData[];
    myFloatingHolidays: IMyFloatingHolidaysData[];
    myLeaveBalance: IMyLeaveBalance[];
    myLeaveInfo: IMyLeaveInfo[];
    upcomingBirthdays: IUpcomingBirthdays[];
}
