export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public errorType: string = "generic-error"
    ) {
        super(message);
    }
}
