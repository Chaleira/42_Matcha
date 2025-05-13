import db from "../database/db";
import { deleteQuery, insertQuery, selectWhere, updateQuery } from "../database/sqlHelper";

export interface IBlock {
	blocker_id: number;
	blocked_id: number;
	created_at?: Date;
}

export const blockModel = {
	async create(block: IBlock): Promise<IBlock> {
		const { text, values } = insertQuery<IBlock>("blocks", block);
		const result = await db.query(text, values);
		return result.rows[0];
	},
	async findByBlockerAndBlocked(blocker_id: number, blocked_id: number): Promise<IBlock | null> {
		const { text, values } = selectWhere("blocks", { blocker_id, blocked_id });
		const result = await db.query(text, values);
		return result.rows[0] || null;
	},
	async findByBlocker(blocker_id: number): Promise<IBlock[] | null> {
		const { text, values } = selectWhere("blocks", { blocker_id });
		const result = await db.query(text, values);
		return result.rows.length > 0 ? result.rows : null;
	},
	async findByBlocked(blocked_id: number): Promise<IBlock[] | null> {
		const { text, values } = selectWhere("blocks", { blocked_id });
		const result = await db.query(text, values);
		return result.rows.length > 0 ? result.rows : null;
	},

	async delete(blocker_id: number, blocked_id: number): Promise<void> {
		const { text, values } = deleteQuery("blocks", { blocker_id, blocked_id });
		await db.query(text, values);
	},
}