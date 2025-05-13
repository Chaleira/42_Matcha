import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedUser {
	id: number;
	username: string;
	email: string;
	iat: number;
	exp: number;
}

export interface AuthenticatedRequest extends Request {
	user: AuthenticatedUser;
}
