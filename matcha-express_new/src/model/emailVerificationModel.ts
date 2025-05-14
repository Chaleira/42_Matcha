import db from "../database/db";
import { insertQuery, selectWhere, updateQuery, deleteQuery } from "../database/sqlHelper";

export interface IEmailVerification {
	id?: number;
	user_id: number;
	token: string;
	created_at?: Date;
	expires_at?: Date;
}

export const emailVerificationModel = {
	async create(emailVerification: IEmailVerification): Promise<IEmailVerification> {
		const { text, values } = insertQuery<IEmailVerification>("email_verification_tokens", emailVerification);
		const result = await db.query(text, values);
		return result.rows[0];
	},
	async findByToken(token: string): Promise<IEmailVerification | null> {
		const { text, values } = selectWhere("email_verification_tokens", { token });
		const result = await db.query(text, values);
		return result.rows[0] || null;
	},
	async findByUserId(userId: number): Promise<IEmailVerification | null> {
		const { text, values } = selectWhere("email_verification_tokens", { user_id: userId });
		const result = await db.query(text, values);
		return result.rows[0] || null;
	},
	async update(id: number, updates: Partial<IEmailVerification>): Promise<IEmailVerification> {
		const { text, values } = updateQuery("email_verification_tokens", updates, { id });
		const result = await db.query(text, values);
		return result.rows[0];
	},
	async delete(id: number): Promise<void> {
		const { text, values } = deleteQuery("email_verification_tokens", { id });
		await db.query(text, values);
	},
};
