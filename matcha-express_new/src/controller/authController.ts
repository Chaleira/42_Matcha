import { Request, Response } from "express";
import { authService } from "../service/authService";
import { IUser } from "../model/userModel";
import { ValidationError } from "../utils/errors";

export const authController = {
	async register(req: Request, res: Response): Promise<void | any> {
		const { username, email, first_name, last_name, password } = req.body;

		if (!username || !email || !first_name || !last_name || !password) throw new ValidationError("All fields are required");

		const user = { username, email, first_name, last_name, password };

		const newUser: IUser = await authService.register(user);

		res.status(201).json(newUser);
	},

	async login(req: Request, res: Response): Promise<void | any> {
		const { username, password } = req.body;

		if (!username || !password) throw new ValidationError("Username and Password required");

		const response = await authService.login(username, password);
		res.status(202).json(response);
	},
};
