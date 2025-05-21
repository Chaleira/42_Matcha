import { insertQuery, updateQuery, deleteQuery, selectWhere, selectWhereFlexible, Condition } from "../database/sqlHelper";
import db from "../database/db";

export interface IProfile {
	user_id: number;
	age?: number;
	bio?: string;
	tags?: string[];
	gender?: string;
	sexual_preference?: string;
	pictures?: string[];
	avatar?: string;
	fame_score?: number;
	latitude?: number;
	longitude?: number;
	first_name?: string;
	last_name?: string;
	like?: {
		i_liked: boolean;
		he_liked: boolean;
	};
	block?: {
		i_blocked: boolean;
		he_blocked: boolean;
	};
	created_at?: Date;
	email?: string;
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

	async listWithFilter(conditions: Condition[], user: { id: number; latitude: number; longitude: number; tags: string[] }, orderBy: string | undefined): Promise<IProfile[] | null> {
		const { text, values } = selectWhereFlexible("profiles", conditions, user, orderBy);
		values.push(user.tags);
		console.log("SQL Query:", text);
		console.log("SQL Values:", values);
		const result = await db.query(text, values);
		return result.rows.length > 0 ? result.rows : null;
	},
};
