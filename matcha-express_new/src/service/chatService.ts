import { chatModel, IChat, IChatMessage } from "../model/chatModel";
import { userService } from "./userService";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import mapDbError from "../utils/mapDbError";
import { notificationService } from "./notificationService";

export const chatService = {
	async createChat(user1_id: number, user2_id: number): Promise<IChat> {
		try {
			return await chatModel.create(user1_id, user2_id);
		} catch (error: any) {
			throw mapDbError.chat(error);
		}
	},

	async createMessage(chat_id: number, sender_id: number, message: string): Promise<IChatMessage> {
		try {
			const chat = await chatModel.getChat(chat_id);
			if (chat?.user1_id !== sender_id && chat?.user2_id !== sender_id) throw new UnauthorizedError("User is not part of the chat");
			const otherUserId = chat?.user1_id === sender_id ? chat?.user2_id : chat?.user1_id;
			const sender = await userService.getUserById(sender_id);
			await notificationService.createNotification(otherUserId, sender_id, "message",
				`${sender?.first_name} ${sender?.last_name}:
				${message}`);
			const receiver = await this.getOtherUserId(chat_id, sender_id);
			const receiverProfile = await userService.getUserProfile(receiver, receiver);
			await userService.updateUserProfile(receiver, { fame_score: receiverProfile!.fame_score! + 1 > 100 ? 100 : receiverProfile!.fame_score! + 1 });
			return await chatModel.createMessage(chat_id, sender_id, message);
		} catch (error: any) {
			throw mapDbError.chat(error);
		}
	},

	async getChatMessages(chat_id: number, user_id: number): Promise<IChatMessage[] | null> {
		try {
			const chat = await chatModel.getChat(chat_id);
			if (!chat) throw new NotFoundError("Chat not found");
			if (chat.user1_id !== user_id && chat.user2_id !== user_id) throw new UnauthorizedError("User is not part of the chat");
			return await chatModel.findChatMessages(chat_id);
		} catch (error: any) {
			throw mapDbError.chat(error);
		}
	},

	async getChat(chat_id: number, user: number): Promise<IChat | null> {
		try {
			const chat = await chatModel.getChat(chat_id);
			if (!chat) throw new NotFoundError("Chat not found");
			if (chat.user1_id !== user && chat.user2_id !== user) throw new UnauthorizedError("User is not part of the chat");
			return chat;
		} catch (error: any) {
			throw mapDbError.chat(error);
		}
	},

	async getUserChats(user_id: number): Promise<IChat[] | null> {
		try {
			const chats = await chatModel.getUserChats(user_id);
			if (!chats) return [];
			for (const chat of chats) {
				const otherUserId = chat.user1_id === user_id ? chat.user2_id : chat.user1_id;
				chat.user1_id = user_id;
				chat.user2_id = otherUserId;
				const user = await userService.getUserById(otherUserId);
				if (user) {
					chat.first_name = user.first_name;
					chat.last_name = user.last_name;
				}
			}
			return chats;
		} catch (error: any) {
			throw mapDbError.chat(error);
		}
	},

	async getChatByUsers(user1_id: number, user2_id: number): Promise<IChat> {
		try {
			const chat = await chatModel.findChat(user1_id, user2_id);
			if (!chat) throw new NotFoundError("Chat not found");
			return chat;
		} catch (error: any) {
			throw mapDbError.chat(error);
		}
	},

	async getOtherUserId(chat_id: number, user_id: number): Promise<number> {
		try {
			const chat = await chatModel.getChat(chat_id);
			if (!chat) throw new NotFoundError("Chat not found");
			if (chat.user1_id !== user_id && chat.user2_id !== user_id) throw new UnauthorizedError("User is not part of the chat");
			return chat.user1_id === user_id ? chat.user2_id : chat.user1_id;
		} catch (error: any) {
			throw mapDbError.chat(error);
		}
	},

	async deleteMessage(messageId: number, user: number): Promise<void> {
		try {
			const message = await chatModel.getMessage(messageId);
			if (!message) throw new NotFoundError("Message not found");
			const chat = await chatModel.getChat(message.chat_id);
			if (!chat) throw new NotFoundError("Chat not found");
			if (chat.user1_id !== user && chat.user2_id !== user) throw new UnauthorizedError("User is not part of the chat");
			await chatModel.deleteMessage(messageId);
		} catch (error: any) {
			throw mapDbError.chat(error);
		}
	},

	async deleteChat(chatId: number, user: number): Promise<void> {
		try {
			const chat = await chatModel.getChat(chatId);
			if (!chat) throw new NotFoundError("Chat not found");
			if (chat.user1_id !== user && chat.user2_id !== user) throw new UnauthorizedError("User is not part of the chat");
			await chatModel.deleteChat(chatId);
		} catch (error: any) {
			throw mapDbError.chat(error);
		}
	},
};
