import dotenv from "dotenv";
dotenv.config();

export const PORT: number = Number(process.env.PORT) || 3001;

export const JWT_SECRET: string = process.env.JWT_SECRET || "";

export const MONGODB_URL: string = process.env.MONGODB_URL || "";
export const DB_NAME: string = process.env.DB_NAME || "javra-chatbot";
export const DB_USER: string = process.env.DB_USER || "";
export const DB_PASS: string = process.env.DB_PASS || "";

export const SPEECH_API_REGION: string = process.env.SPEECH_API_REGION || "";
export const SPEECH_API_KEY: string = process.env.SPEECH_API_KEY || "";
export const SPEECH_API_TOKEN_ENDPOINT: string = "https://centralindia.api.cognitive.microsoft.com/sts/v1.0/issueToken";

export const LANGUAGE_API_REGION: string = process.env.LANGUAGE_API_REGION || "";
export const LANGUAGE_API_KEY: string = process.env.LANGUAGE_API_KEY || "";
export const LANGUAGE_API_INTENT_ENDPOINT: string =
    "https://lang-chatbot-prod-ci-01.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-10-01-preview";

export const MESSAGE_FETCH_LIMIT: number = 15;

export const HRM_BASE_URL: string = process.env.HRM_BASE_URL || "https://hrmtest.javra.com";
export const HRM_EMPLOYEE_API_URL: string = process.env.HRM_EMPLOYEE_API_URL || "https://hrmtest.javra.com/api/employees/getEmployeeImage";
export const XEPST_EMPLOYEE_LOGIN: string = process.env.XEPST_EMPLOYEE_LOGIN || "https://testxepst.javra.com/cgi-bin/wspd_cgi.sh/WService=xepst-test-web/js/jsread.p?call=login";
export const USER_DATA_API_URL: string = process.env.USER_DATA_API_URL || "https://testxepst.javra.com/cgi-bin/wspd_cgi.sh/WService=%20xepst-test-web/js/jsread.p?call=emppunctual";
