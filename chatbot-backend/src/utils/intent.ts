import axios from "axios";

import { ApiError } from "../classes/ApiError";
import { LANGUAGE_API_KEY, LANGUAGE_API_INTENT_ENDPOINT } from "../config/constants";

export const findIntentFromText = async (userInput: string) => {
    try {
        const requestBody = {
            analysisInput: {
                conversationItem: {
                    id: "1",
                    participantId: "1",
                    text: userInput
                }
            },
            kind: "Conversation",
            parameters: {
                projectName: "javra-chatbot",
                deploymentName: "javra-chatbot-dep-1",
                stringIndexType: "TextElement_V8"
            }
        };

        const response = await axios.post(LANGUAGE_API_INTENT_ENDPOINT, requestBody, {
            headers: {
                "Ocp-Apim-Subscription-Key": LANGUAGE_API_KEY
            }
        });

        console.log("Intent Information ", response.data.result.prediction.intents);
        console.log("Entity Information ", response.data.result.prediction.entities);

        return response.data.result;
    } catch (err: any) {
        console.log(err.response.data);
        throw new ApiError("Cannot find the intent", 400);
    }
};
