import { Response } from "express";
import { UserSearchFilters, userService } from "../service/userService";
import { AuthenticatedRequest } from "../types/request";

export const userController = {

	async getUserById(req: AuthenticatedRequest, res: Response): Promise<void> {
		const userId = parseInt(req.query.id as string);
		const user = await userService.getUserById(userId);
		res.status(200).json(user);
	},

	async getUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
		const userId = parseInt(req.query.id as string);
		const userProfile = await userService.getUserProfile(req.user.id ,userId || req.user.id);
		res.status(200).json(userProfile);
	},

	async updateUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
		const userId = req.user.id;
		const updates = req.body;
		const updatedUserProfile = await userService.updateUserProfile(userId, updates);
		res.status(200).json(updatedUserProfile);
	},

	async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
		const userId = req.user.id;
		await userService.deleteUser(userId);
		res.status(204).send();
	},

	async listUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
		const users = await userService.listUsers(req.query as UserSearchFilters);
		res.status(200).json(users);
	},
};
