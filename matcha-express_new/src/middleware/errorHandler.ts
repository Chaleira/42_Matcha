import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/errors";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next): any => {
	console.error("Error Message: ", err.message);
	console.error("Error Status: ", err.statusCode);
	if (err instanceof AppError) return res.status(err.statusCode).json({ message: err.message });
	res.status(500).json({ message: "Internal Server Error", code: err.code, detail: err.detail, table: err.table });
};
