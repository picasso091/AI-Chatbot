import { checkStringSimilarity } from "./stringSimilarity";

export const findDatesFromRange = (begin: string, end: string): string[] => {
    const dates: string[] = [];
    if (begin && end) {
        const startDate = new Date(begin);
        const endDate = new Date(end);

        let currentDate = startDate;

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate).toString());
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    return dates;
};

export const filterPastDates = (dates: string[]): string[] =>
    dates.filter((date) => {
        const dateVar = new Date(date);
        dateVar.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dateVar >= today;
    });

// Filter out and find date values
export const findDatesFromEntity = (entities: { [key: string]: any }[]): string[] => {
    let dates: string[] = [];
    entities.forEach((entity) => {
        if (entity.resolutions) {
            entity.resolutions.forEach((resolution: any) => {
                if (resolution.resolutionKind === "DateTimeResolution") {
                    const date = resolution.value;
                    dates.push(date);
                }
                if (resolution.resolutionKind === "TemporalSpanResolution") {
                    const begin = resolution.begin;
                    const end = resolution.end;
                    const date = findDatesFromRange(begin, end);
                    dates = [...dates, ...date];
                }
            });
        } else {
            const foundDate = parseNaturalDate(entity.text);
            console.log("PARSING OF NATURAL DATE");
            if (foundDate) {
                dates.push(foundDate);
            }
        }
    });

    return dates;
};

// Filter out and find country values
export const findCountriesFromEntity = (entities: { [key: string]: any }[]): string[] => {
    const countries: string[] = [];
    const PORTUGAL_SYNONYMS = ["portugal", "portuglese"];
    const NEPAL_SYNONYMS = ["nepal", "nepali", "nepalese"];
    const NETHERLANDS_SYNONYMS = ["netherland", "netherlands"];
    entities.forEach((entity) => {
        if (PORTUGAL_SYNONYMS.includes(entity.text.toLowerCase())) {
            countries.push("Portugal");
        }
        if (NEPAL_SYNONYMS.includes(entity.text.toLowerCase())) {
            countries.push("Nepal");
        }
        if (NETHERLANDS_SYNONYMS.includes(entity.text.toLowerCase())) {
            countries.push("Netherlands");
        }
    });

    return countries;
};

export const parseNaturalDate = (date: string): string | null => {
    if (checkStringSimilarity(date, "day after tomorrow") > 0.88) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 2);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const day = String(tomorrow.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }
    if (checkStringSimilarity(date, "tomorrow") > 0.9) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const day = String(tomorrow.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }
    return null;
};
