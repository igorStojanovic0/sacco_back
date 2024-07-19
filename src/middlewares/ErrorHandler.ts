import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode: number;
  code?: number; // Add optional code property
  details?: { message: string }[]; // Array of objects with type { message: string }
  keyValue: {};
  value?: string;
}

const ErrorHandlerMiddleware = ( err: CustomError, req: Request, res: Response, next: NextFunction ) => {
  let errStatus: number = err.statusCode || 500;
  let errMessage: string = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    const errorMessages = err.details?.map((detail) => detail.message); // Use optional chaining
    if (errorMessages) { // Check if messages exist before joining
      errMessage = errorMessages.join(",");
    }
    errStatus = 400;
  }

  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    errMessage = `Duplicate value entered for ${field} field, please choose another value`;
    errStatus = 400;
  }

  if (err.name === "CastError") {
    errMessage = `No item found with id: ${err.value}`;
    errStatus = 404;
  }

  console.log(errMessage);

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

export default ErrorHandlerMiddleware;
