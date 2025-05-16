import { notificationModel, INotification } from "../model/noficatonModel";
import { NotFoundError, ValidationError, UnauthorizedError } from "../utils/errors";
import mapDbError from "../utils/mapDbError";
import { onlineUsers } from "../socket/connection";
import { io } from "../socket/index";


export const notificationService = {
	async createNotification(user_id: number, triggered_by_id: number, type: string, content: string): Promise<INotification> {
		try {
			const notification = await notificationModel.create(user_id, triggered_by_id, type, content);
			const socket_id = onlineUsers.get(user_id);
			if (socket_id)
				io.to(socket_id).emit("notification", notification);
			return notification;
		} catch (error: any) {
			throw mapDbError.notification(error);
		}
	},

	async getNotifications(user_id: number): Promise<INotification[]> {
		try {
			const notifications = await notificationModel.findByUserId(user_id);
			if (!notifications) throw new NotFoundError("No notifications found");
			return notifications;
		} catch (error: any) {
			throw mapDbError.notification(error);
		}
	},

	async getNotification(id: number): Promise<INotification | null> {
		try {
			const notification = await notificationModel.findById(id);
			if (!notification) throw new NotFoundError("Notification not found");
			return notification;
		} catch (error: any) {
			throw mapDbError.notification(error);
		}
	},

	async updateNotification(id: number, data: Partial<INotification>): Promise<INotification | null> {
		try {
			const notification = await notificationModel.update(id, data);
			if (!notification) throw new NotFoundError("Notification not found");
			return notification;
		} catch (error: any) {
			throw mapDbError.notification(error);
		}
	},

	async deleteNotification(id: number): Promise<void> {
		try {
			await notificationModel.delete(id);
		} catch (error: any) {
			throw mapDbError.notification(error);
		}
	}
};