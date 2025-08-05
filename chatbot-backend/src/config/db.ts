import mongoose, { ConnectOptions } from "mongoose";

import { MONGODB_URL, DB_NAME, DB_USER, DB_PASS } from "./constants";

let dbOptions: ConnectOptions = {
    family: undefined,
    hints: undefined,
    localAddress: undefined,
    localPort: undefined,
    lookup: undefined
} as ConnectOptions;

if (DB_USER && DB_PASS) {
    dbOptions = {
        ...dbOptions,
        dbName: DB_NAME,
        user: DB_USER,
        pass: DB_PASS
    }
} else {
    dbOptions = {
        ...dbOptions,
        dbName: DB_NAME,
    }
}

const connect = () => {
    return mongoose
        .connect(MONGODB_URL, dbOptions)
        .then((result) => {
            console.log("Connected to database..");
            return result;
        })
        .catch((error) => {
            console.log("Error while connecting to database\n", error);
            setTimeout(() => {
                console.log("Trying to connect to database..");
                connect();
            }, 3000);
        });
};

export default connect;
