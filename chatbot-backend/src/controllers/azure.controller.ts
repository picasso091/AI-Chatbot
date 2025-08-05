import axios from "axios";
import { RequestHandler } from "express";

import { ApiError } from "../classes/ApiError";
import { SPEECH_API_KEY, SPEECH_API_TOKEN_ENDPOINT, SPEECH_API_REGION } from "../config/constants";

export const getSpeechToken: RequestHandler = async (req, res, next) => {
    const requestOptions = {
        headers: {
            "Ocp-Apim-Subscription-Key": SPEECH_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    try {
        const tokenResponse = await axios.post(SPEECH_API_TOKEN_ENDPOINT, null, requestOptions);
        res.status(200).json({
            success: true,
            token: tokenResponse.data,
            region: SPEECH_API_REGION
        });
    } catch (err: any) {
        console.log(err.response);
        next(new ApiError("Error authorizing speech key", 400));
    }
};
