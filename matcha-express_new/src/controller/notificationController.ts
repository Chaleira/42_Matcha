import { notificationService } from "../service/notificationService";
import { AuthenticatedRequest } from "../types/request";
import { Response } from "express";
import { ValidationError } from "../utils/errors";

export const notificationController = {
	async createNotification(req: AuthenticatedRequest, res: Response): Promise<any> {
		const user_id = req.user.id;
		const { triggered_by_id, type, content } = req.body;
		const notification = await notificationService.createNotification(user_id, triggered_by_id, type, content);
		res.status(201).json(notification);
	},

	async getNotifications(req: AuthenticatedRequest, res: Response): Promise<any> {
		const user_id = req.user.id;
		const notifications = await notificationService.getNotifications(user_id);
		res.status(200).json(notifications);
	},

	async getNotification(req: AuthenticatedRequest, res: Response): Promise<any> {
		const id = parseInt(req.query.id as string);
		const notification = await notificationService.getNotification(id);
		res.status(200).json(notification);
	},

	async updateNotification(req: AuthenticatedRequest, res: Response): Promise<any> {
		const id = parseInt(req.query.id as string);
		const data = req.body;
		const notification = await notificationService.updateNotification(id, data);
		res.status(200).json(notification);
	},

	async deleteNotification(req: AuthenticatedRequest, res: Response): Promise<any> {
		const id = parseInt(req.query.id as string);
		await notificationService.deleteNotification(id);
		res.status(204).send();
	},
};