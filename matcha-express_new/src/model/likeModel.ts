import db from "../database/db";
import { deleteQuery, insertQuery, selectWhere, updateQuery } from "../database/sqlHelper";

export interface ILike {
	liker_id: number;
	liked_id: number;
	created_at?: Date;
}

export const likeModel = {
	async create(like: ILike): Promise<ILike> {
		const { text, values } = insertQuery<ILike>("likes", like);
		const result = await db.query(text, values);
		return result.rows[0];
	},
	async findByLikerAndLiked(liker_id: number, liked_id: number): Promise<ILike | null> {
		const { text, values } = selectWhere("likes", { liker_id, liked_id });
		const result = await db.query(text, values);
		return result.rows[0] || null;
	},
	async findByLiker(liker_id: number): Promise<ILike[] | null> {
		const { text, values } = selectWhere("likes", { liker_id });
		const result = await db.query(text, values);
		return result.rows.length > 0 ? result.rows : null;
	},
	async findByLiked(liked_id: number): Promise<ILike[] | null> {
		const { text, values } = selectWhere("likes", { liked_id });
		const result = await db.query(text, values);
		return result.rows.length > 0 ? result.rows : null;
	},

	async delete(liker_id: number, liked_id: number): Promise<void> {
		const { text, values } = deleteQuery("likes", { liker_id, liked_id });
		await db.query(text, values);
	},
};
