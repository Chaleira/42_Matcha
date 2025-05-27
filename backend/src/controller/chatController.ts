import { chatService } from "../service/chatService";
import { AuthenticatedRequest } from "../types/request";
import { ValidationError } from "../utils/errors";
import { Response } from "express";

export const chatController = {
	async createChat(req: AuthenticatedRequest, res: Response): Promise<any> {
		const user1_id = req.user.id;
		const user2_id = parseInt(req.query.user_id as string);
		const chat = await chatService.createChat(user1_id, user2_id);
		res.status(201).json(chat);
	},

	async createMessage(req: AuthenticatedRequest, res: Response) {
		const chat_id = parseInt(req.query.chat_id as string);
		const sender_id = req.user.id;
		const message = req.body.message;
		const chatMessage = await chatService.createMessage(chat_id, sender_id, message);
		res.status(201).json(chatMessage);
	},

	async getChatMessages(req: AuthenticatedRequest, res: Response) {
		const chat_id = parseInt(req.query.chat_id as string);
		const chatMessages = await chatService.getChatMessages(chat_id, req.user.id);
		res.status(200).json(chatMessages);
	},

	async getChat(req: AuthenticatedRequest, res: Response) {
		const chat_id = parseInt(req.query.chat_id as string);
		const chat = await chatService.getChat(chat_id, req.user.id);
		res.status(200).json(chat);
	},

	async getUserChats(req: AuthenticatedRequest, res: Response) {
		const userId = req.user.id;
		const chats = await chatService.getUserChats(userId);
		res.status(200).json(chats);
	},

	async deleteMessage(req: AuthenticatedRequest, res: Response) {
		const messageId = parseInt(req.query.message_id as string);
		await chatService.deleteMessage(messageId, req.user.id);
		res.status(204).send();
	},

	async deleteChat(req: AuthenticatedRequest, res: Response) {
		const chatId = parseInt(req.query.chat_id as string);
		await chatService.deleteChat(chatId, req.user.id);
		res.status(204).send();
	},
};
