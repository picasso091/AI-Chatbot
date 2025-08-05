import {
    PORT,
    MONGODB_URL,
    JWT_SECRET,
    SPEECH_API_KEY,
    SPEECH_API_REGION,
    LANGUAGE_API_KEY,
    LANGUAGE_API_REGION
} from "../config/constants";

export const hasRequiredVars = (): boolean => {
    if (
        !PORT ||
        !MONGODB_URL ||
        !JWT_SECRET ||
        !SPEECH_API_KEY ||
        !SPEECH_API_REGION ||
        !LANGUAGE_API_KEY ||
        !LANGUAGE_API_REGION
    ) {
        return false;
    } else {
        return true;
    }
};
