import { JWT_SECRET } from "../config/config";
import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "../types/request";

export function verifyToken(token: string): AuthenticatedUser | null {
	try {
	  return jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
	} catch {
	  return null;
	}
  }