import CustomError from "./CustomError.js";

/**
 * Custom error class for handling bad request errors.
 * @extends {CustomError} - Extends the CustomError class.
 */
export class UnauthorizedError extends CustomError {
    statusCode: number;
    /**
     * Constructor for the BadRequestError class.
     * @param {string} message - The error message to be displayed.
     */
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
    }
}