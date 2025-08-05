import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import routes from "./routes";
import mongooseConnect from "./config/db";
import { globalErrorHandler } from "./middleware/errorHandler";
import { PORT } from "./config/constants";
import { hasRequiredVars } from "./utils/checkRequiredVars";

if (hasRequiredVars()) {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.use(routes);
    app.use(globalErrorHandler);

    console.log("Connecting to database...");
    mongooseConnect().then(() => {
        app.listen(PORT, () => {
            console.log(`Server Started at http://localhost:${PORT}`);
        });
    });
} else {
    console.error("ERROR = Ensure all the required ENV variables are present");
}
