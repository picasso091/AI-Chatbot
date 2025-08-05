import { ErrorRequestHandler } from "express";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    Error.captureStackTrace(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "An error occurred. Please try again";
    err.errorType = err.errorType || "generic-error";

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errorType: err.errorType
    });
};

export default globalErrorHandler;
