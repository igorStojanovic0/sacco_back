import CustomError from "./CustomError.js";

/**
 * @class
 * @classdesc Custom error class for 404 Not Found responses.
 * @extends {CustomError}
 */
export class NotFoundError extends CustomError {
    statusCode: number;
    /**
     * Creates a new NotFoundError instance.
     * @param {string} message - Error message.
     */
    constructor(message: string) {
        super(message);
        this.statusCode = 404;
    }
}