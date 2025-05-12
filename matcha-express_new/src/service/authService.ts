import { IUser } from "../model/userModel";
import { userService } from "../service/userService";
import mapDbError from "../utils/mapDbError";
import { UnauthorizedError } from "../utils/errors";
import bcrypt from "bcryptjs";

export const authService = {
	async register(user: IUser): Promise<IUser> {
		try {
			user.password = await bcrypt.hash(user.password, 10);
			return await userService.createUser(user);
		} catch (error: any) {
			throw mapDbError.auth(error);
		}
	},

	async login(username: string, password: string): Promise<{ token: string; user: Omit<IUser, "password"> }> {
		try {
			const user = await userService.authFind(username);
			if (!user) throw new UnauthorizedError("Invalid credentials");

			const match = await bcrypt.compare(password, user.password);
			if (!match) throw new UnauthorizedError("Invalid credentials");

			const token = userService.generateUserToken(user);

			const { password: _pw, ...safeUser } = user;

			return { token, user: safeUser };
		} catch (error: any) {
			throw mapDbError.auth(error);
		}
	},
};
