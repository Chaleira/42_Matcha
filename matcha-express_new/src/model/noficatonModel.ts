import db from "../database/db"
import { deleteQuery, insertQuery, selectWhere, updateQuery } from "../database/sqlHelper";

export interface INotification {
	id?: number,
	user_id: number,
	triggered_by_id: number,
	type: string,
	content: string,
	seen: boolean,
	created_at?: Date
}

export const notificationModel = {
	async create(user_id: number, triggered_by_id: number, type: string, content: string): Promise<INotification> {
		const { text, values } = insertQuery<INotification>("notifications", { user_id, triggered_by_id, type, content, seen: false });
		const result = await db.query(text, values);
		return result.rows[0];
	},

	async findByUserId(user_id: number): Promise<INotification[]> {
		const { text, values } = selectWhere("notifications", { user_id });
		const result = await db.query(text, values);
		if (result.rows.length === 0) return [];
		return result.rows;
	},

	async findById(id: number): Promise<INotification | null> {
		const { text, values } = selectWhere("notifications", { id });
		const result = await db.query(text, values);
		if (result.rows.length === 0) return null;
		return result.rows[0];
	},

	async update(id: number, data: Partial<INotification>): Promise<INotification | null> {
		const { text, values } = updateQuery("notifications", data, { id });
		const result = await db.query(text, values);
		if (result.rows.length === 0) return null;
		return result.rows[0];
	},

	async delete(id: number): Promise<void> {
		const { text, values } = deleteQuery("notifications", { id });
		await db.query(text, values);
	}
};