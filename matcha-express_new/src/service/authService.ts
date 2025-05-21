import { IUser } from "../model/userModel";
import { userService } from "../service/userService";
import { emailVerificationService } from "./emailVerificationService";
import mapDbError from "../utils/mapDbError";
import { UnauthorizedError } from "../utils/errors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const authService = {
	async register(user: IUser): Promise<Omit<IUser, "password">> {
		try {
			user.password = await bcrypt.hash(user.password, 10);
			const newUser = await userService.createUser(user);
			const token = await emailVerificationService.generateEmailVerificationToken();
			if (!newUser || !newUser.id) throw new UnauthorizedError("User creation failed");
			await emailVerificationService.createEmailVerification(newUser.id, token);
			await emailVerificationService.sendVerificationEmail(user.email, token, {text: " to verify your email.", subject: "Email Verification", url: "verify-email"});

			const { password: _pw, ...safeUser } = newUser;

			return safeUser;
		} catch (error: any) {
			throw mapDbError.auth(error);
		}
	},

	async login(username: string, password: string): Promise<{ token: string; user: Omit<IUser, "password"> }> {
		try {
			const user = await userService.authFind(username);
			if (!user) throw new UnauthorizedError("Invalid credentials");

			// Uncomment this line to add email verification login
			if (!user.email_verified) throw new UnauthorizedError("Verify your email first!");

			const match = await bcrypt.compare(password, user.password);
			if (!match) throw new UnauthorizedError("Invalid credentials");

			const token = userService.generateUserToken(user);

			const { password: _pw, ...safeUser } = user;

			return { token, user: safeUser };
		} catch (error: any) {
			throw mapDbError.auth(error);
		}
	},

	async generateResetToken(): Promise<string> {
		return crypto.randomBytes(32).toString("hex");
	},

	async verifyEmail(token: string): Promise<{ message: string; username: string }> {
		try {
			const emailVerification = await emailVerificationService.findByToken(token);
			if (!emailVerification) throw new UnauthorizedError("Invalid or expired token");
			if (!emailVerification.id) throw new UnauthorizedError("Invalid token");
			if (emailVerification.expires_at && emailVerification.expires_at < new Date()) throw new UnauthorizedError("Token expired");
			const userId = emailVerification.user_id;
			const user = await userService.getUserById(userId);
			await userService.updateUser(userId, { email_verified: true });
			await emailVerificationService.deleteEmailVerification(emailVerification.id);
			return { message: "Email verified successfully", username: user?.username! };
		} catch (error: any) {
			throw mapDbError.auth(error);
		}
	},

	async resetPassword(email: string): Promise<{ message: string }> {
		try {
			const user = await userService.getUserByEmail(email);
			if (!user) throw new UnauthorizedError("User not found");
			const token = await emailVerificationService.generateEmailVerificationToken();
			await emailVerificationService.createEmailVerification(user.id!, token);
			await emailVerificationService.sendVerificationEmail(email, token, {text: " to reset your password.", subject: "Password Reset", url: "reset-password"});
			return { message: "Password reset email sent" };
		} catch (error: any) {
			throw mapDbError.auth(error);
		}
	},

	async verifyResetPassword(token: string, password: string): Promise<{ message: string }> {
		try {
			const emailVerification = await emailVerificationService.findByToken(token);
			if (!emailVerification) throw new UnauthorizedError("Invalid or expired token");
			if (!emailVerification.id) throw new UnauthorizedError("Invalid token");
			if (emailVerification.expires_at && emailVerification.expires_at < new Date()) throw new UnauthorizedError("Token expired");
			const userId = emailVerification.user_id;
			const user = await userService.getUserById(userId);
			if (!user) throw new UnauthorizedError("User not found");
			user.password = await bcrypt.hash(password, 10);
			await userService.updateUser(userId, { password: user.password });
			await emailVerificationService.deleteEmailVerification(emailVerification.id);
			return { message: "Password reset successfully" };
		} catch (error: any) {
			throw mapDbError.auth(error);
		}
	},
};
