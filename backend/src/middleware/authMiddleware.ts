import { Response, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest, AuthenticatedUser } from "../types/request";
import { UnauthorizedError } from "../utils/errors";
import { verifyToken } from "../utils/verifyToken";

export const authenticateUser: RequestHandler | any = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	const token = req?.cookies?.token;

	if (!token) return next(new UnauthorizedError("Access Denied!"));

	const decoded = verifyToken(token);
	if (!decoded) return next(new UnauthorizedError("Access Denied!"));
	(req as AuthenticatedRequest).user = decoded as AuthenticatedUser;
	next();
};
