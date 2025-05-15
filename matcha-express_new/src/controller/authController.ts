import { Request, Response } from "express";
import { authService } from "../service/authService";
import { IUser } from "../model/userModel";
import { ValidationError } from "../utils/errors";
import { userService } from "../service/userService";

export const authController = {
	async register(req: Request, res: Response): Promise<void | any> {
		const { username, email, first_name, last_name, password, bio, age, tags, gender, sexual_preference, pictures, avatar, fame_score, latitude, longitude} = req.body;

		const user = { username, email, first_name, last_name, password };
		const profile  = {bio, age, tags, gender, sexual_preference, pictures, avatar, latitude, longitude}

		const newUser: Omit<IUser, "password"> = await authService.register(user);
		await userService.updateUserProfile(newUser.id!, profile)

		res.status(201).json(newUser);
	},

	async login(req: Request, res: Response): Promise<void | any> {
		const { username, password } = req.body;

		const response = await authService.login(username, password);
		res.status(202).json(response);
	},

	async verifyEmail(req: Request, res: Response): Promise<void | any> {
		const { token } = req.query;

		if (!token) throw new ValidationError("Token is required");

		const response = await authService.verifyEmail(token as string);
		res.status(200).json(response);
	},
};
