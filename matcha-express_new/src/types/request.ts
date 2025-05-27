import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedUser {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	iat: number;
	exp: number;
}

export interface AuthenticatedRequest extends Request {
	user: AuthenticatedUser;
}
