import { Request, Response, NextFunction } from "express";
import { environment } from "../config/environment";

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    path: req.path,
  });
};

export const errorHandler = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log error
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  if (err.stack && environment.nodeEnv === "development") {
    console.error(err.stack);
  }

  // Default to 500 server error
  let statusCode = 500;
  let errorMessage = "Internal Server Error";

  // Check if it's a known HTTP error
  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  } else if (err.name === "SyntaxError") {
    statusCode = 400;
    errorMessage = "Invalid JSON provided";
  }

  // Only return detailed error in development
  const errorResponse = {
    success: false,
    message: errorMessage,
    ...(environment.nodeEnv === "development" && {
      stack: err.stack,
      detail: err.message,
    }),
  };

  res.status(statusCode).json(errorResponse);
};
