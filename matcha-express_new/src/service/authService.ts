import { IUser } from "../model/userModel";
import { userService } from "../service/userService";
import { emailVerificationService } from "./emailVerificationService";
import mapDbError from "../utils/mapDbError";
import { UnauthorizedError } from "../utils/errors";
import bcrypt from "bcryptjs";

export const authService = {
	async register(user: IUser): Promise<Omit<IUser, "password">> {
		try {
			user.password = await bcrypt.hash(user.password, 10);
			const newUser = await userService.createUser(user);
			const token = await emailVerificationService.generateEmailVerificationToken();
			if (!newUser || !newUser.id) throw new UnauthorizedError("User creation failed");
			await emailVerificationService.createEmailVerification(newUser.id, token);
			await emailVerificationService.sendVerificationEmail(user.email, token);

			const { password: _pw, ...safeUser } = newUser

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

	async verifyEmail(token: string): Promise<{ message: string, username: string }> {
		const emailVerification = await emailVerificationService.findByToken(token);
		if (!emailVerification) throw new UnauthorizedError("Invalid or expired token");
		if (!emailVerification.id) throw new UnauthorizedError("Invalid token");
		// if (emailVerification.expires_at && emailVerification.expires_at < new Date()) throw new UnauthorizedError("Token expired");
		const userId = emailVerification.user_id;
		const user = await userService.getUserById(userId)
		await userService.updateUser(userId, { email_verified: true });
		await emailVerificationService.deleteEmailVerification(emailVerification.id);
		return { message: "Email verified successfully", username: user?.username! };
	},

};
