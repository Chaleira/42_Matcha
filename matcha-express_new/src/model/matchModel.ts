import db from '../database/db';
import { deleteQuery, insertQuery, selectWhere } from '../database/sqlHelper';

export interface IMatch {
	user1_id: number;
	user2_id: number;
	created_at?: Date;
}

export const matchModel = {
	async create(user1Id: number, user2Id: number): Promise<IMatch> {
		if (user1Id > user2Id)
			[user1Id, user2Id] = [user2Id, user1Id];
		const { text, values } = insertQuery<IMatch>('matches', {user1_id: user1Id, user2_id: user2Id});
		const result = await db.query(text, values);
		return result.rows[0];
	},

	async getMatchesForUser(userId: number): Promise<any[] | null> {
		const query = `
			SELECT *
			FROM matches
			WHERE user1_id = $1 OR user2_id = $1
		`;
		const result = await db.query(query, [userId]);
		return result.rows.length > 0 ? result.rows : null;
	},

	async getMatch(user1Id: number, user2Id: number): Promise<IMatch | null> {
		if (user1Id > user2Id)
			[user1Id, user2Id] = [user2Id, user1Id];
		const { text, values } = selectWhere('matches', { user1_id: user1Id, user2_id: user2Id });
		const result = await db.query(text, values);
		return result.rows[0] || null;
	},

	async delete(user1Id: number, user2Id: number): Promise<void> {
		if (user1Id > user2Id)
			[user1Id, user2Id] = [user2Id, user1Id];
		const { text, values } = deleteQuery('matches', { user1_id: user1Id, user2_id: user2Id });
		await db.query(text, values);
	},
};