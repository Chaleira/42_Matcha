import { insertQuery, updateQuery, deleteQuery, selectWhere, selectWhereFlexible, Condition } from "../database/sqlHelper";
import db from "../database/db";

export interface IProfile {
	user_id: number;
	bio?: string;
	tags?: string[];
	gender?: string;
	sexual_preference?: string;
	pictures?: string[];
	fame_score?: number;
	latitude?: number;
	longitude?: number;
	first_name?: string;
	last_name?: string;
	created_at?: Date;
}

export const profileModel = {
	async create(profile: IProfile): Promise<IProfile> {
		const { text, values } = insertQuery<IProfile>("profiles", profile);
		const result = await db.query(text, values);
		return result.rows[0];
	},

	async findByUserId(user_id: number): Promise<IProfile | null> {
		const { text, values } = selectWhere("profiles", { user_id });
		const result = await db.query(text, values);
		return result.rows[0] || null;
	},

	async update(user_id: number, updates: Partial<IProfile>): Promise<IProfile> {
		const { text, values } = updateQuery("profiles", updates, { user_id });
		const result = await db.query(text, values);
		return result.rows[0];
	},
	async delete(user_id: number): Promise<void> {
		const { text, values } = deleteQuery("profiles", { user_id });
		await db.query(text, values);
	},

	async listWithFilter(conditions: Condition[]): Promise<IProfile[] | null> {
		const { text, values } = selectWhereFlexible("profiles", conditions);
		const result = await db.query(text, values);
		return result.rows.length > 0 ? result.rows : null;
	  },
};