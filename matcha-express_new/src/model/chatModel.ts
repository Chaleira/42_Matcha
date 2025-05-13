import db from "../database/db";
import { deleteQuery, insertQuery, selectWhere, updateQuery } from "../database/sqlHelper";

export interface IChat {
	id?: number;
	user1_id: number;
	user2_id: number;
	first_name?: string;
	last_name?: string;
	created_at?: Date;
}

export interface IChatMessage {
	id?: number;
	chat_id: number;
	sender_id: number;
	text: string;
	is_read?: boolean;
	created_at?: Date;
}

export const chatModel = {
	async create(user1_id: number, user2_id: number): Promise<IChat> {
		if (user1_id > user2_id) [user1_id, user2_id] = [user2_id, user1_id];
		const { text, values } = insertQuery<IChat>("chats", { user1_id: user1_id, user2_id: user2_id });
		const result = await db.query(text, values);
		return result.rows[0];
	},

	async createMessage(chat_id: number, sender_id: number, message: string): Promise<IChatMessage> {
		const { text, values } = insertQuery<IChatMessage>("messages", { chat_id: chat_id, sender_id: sender_id, text: message });
		const result = await db.query(text, values);
		return result.rows[0];
	},

	async findChat(user1_id: number, user2_id: number): Promise<IChat | null> {
		if (user1_id > user2_id) [user1_id, user2_id] = [user2_id, user1_id];
		const { text, values } = selectWhere<IChat>("chats", { user1_id: user1_id, user2_id: user2_id });
		const result = await db.query(text, values);
		if (result.rows.length === 0) return null;
		return result.rows[0];
	},
	async findChatMessages(chat_id: number): Promise<IChatMessage[] | null> {
		const { text, values } = selectWhere("messages", { chat_id });
		const result = await db.query(text, values);
		if (result.rows.length === 0) return [];
		return result.rows.length > 0 ? result.rows : null;
	},

	async getChat(chat_id: number): Promise<IChat | null> {
		const { text, values } = selectWhere("chats", { id: chat_id });
		const result = await db.query(text, values);
		if (result.rows.length === 0) return null;
		return result.rows[0];
	},

	async getMessage(message_id: number): Promise<IChatMessage | null> {
		const { text, values } = selectWhere("messages", { id: message_id });
		const result = await db.query(text, values);
		if (result.rows.length === 0) return null;
		return result.rows[0];
	},

	async getUserChats(user_id: number): Promise<IChat[] | null> {
		const query = `
			SELECT *
			FROM chats
			WHERE user1_id = $1 OR user2_id = $1
		`;
		const result = await db.query(query, [user_id]);
		return result.rows.length > 0 ? result.rows : null;
	},

	async deleteChat(id: number): Promise<void> {
		const { text, values } = deleteQuery("chats", { id: id });
		await db.query(text, values);
	},

	async deleteMessage(id: number): Promise<void> {
		const { text, values } = deleteQuery("messages", { id });
		await db.query(text, values);
	},
};
