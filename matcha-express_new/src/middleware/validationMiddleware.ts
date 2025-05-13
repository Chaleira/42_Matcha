import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/request";
import { ValidationError } from "../utils/errors";

export function validateQueryParams(allowedParams: string[] | null, requiredParams?: string[]): any {
	return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		if (allowedParams === null && req.query && Object.keys(req.query).length > 0) return next(new ValidationError("No query parameters are allowed"));
		if (allowedParams === null) return next();
		const queryKeys = Object.keys(req.query);
		const missingParams = requiredParams?.filter((param) => !queryKeys.includes(param));
		if (missingParams && missingParams.length > 0) return next(new ValidationError(`Missing required parameters: ${missingParams.join(", ")}`));
		const invalidParams = queryKeys.filter((key) => !allowedParams.includes(key));

		if (invalidParams.length > 0) {
			return next(new ValidationError(`Invalid parameters: ${invalidParams.join(", ")}`));
		}

		next();
	};
}

export function validateBodyParams(allowedParams: string[] | null, requiredParams?: string[]): any {
	return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		if (allowedParams === null && req.body && Object.keys(req.body).length > 0) return next(new ValidationError("No body parameters are allowed"));
		if (allowedParams === null) return next();
		const bodyKeys = Object.keys(req.body);
		const missingParams = requiredParams?.filter((param) => !bodyKeys.includes(param));
		if (missingParams && missingParams.length > 0) return next(new ValidationError(`Missing required parameters: ${missingParams.join(", ")}`));
		const invalidParams = bodyKeys.filter((key) => !allowedParams.includes(key));

		if (invalidParams.length > 0) {
			return next(new ValidationError(`Invalid body parameters: ${invalidParams.join(", ")}`));
		}

		next();
	};
}
