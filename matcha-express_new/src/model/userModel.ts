import { insertQuery, updateQuery, deleteQuery, selectWhere} from "../database/sqlHelper";
import db from "../database/db";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/config";
import jwt from "jsonwebtoken";

export interface IUser {
	id?: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	password: string;
	created_at?: Date;
}

export const userModel = {
	async create(user: IUser): Promise<IUser> {
		const { text, values } = insertQuery<IUser>("users", user);
		const result = await db.query(text, values);
		return result.rows[0];
	},

	async findByEmail(email: string): Promise<IUser | null> {
		const { text, values } = selectWhere("users", { email });
		const result = await db.query(text, values);
		const user = result.rows[0];
		if (user) delete user.password; // Remove password from the result
		return user || null;
	},

	async findById(id: number): Promise<IUser | null> {
		const { text, values } = selectWhere("users", { id });
		const result = await db.query(text, values);
		const user = result.rows[0];
		if (user) delete user.password; // Remove password from the result
		return user || null;
	},

	async findByUsername(username: string): Promise<IUser | null> {
		const { text, values } = selectWhere("users", { username });
		const result = await db.query(text, values);
		const user = result.rows[0];
		if (user) delete user.password; // Remove password from the result
		return user || null;
	},

	async authFind(username: string): Promise<IUser | null> {
		const { text, values } = selectWhere("users", { username });
		const result = await db.query(text, values);
		return result.rows[0] || null;
	},

	generateToken(user: IUser): string {
		const payload = { id: user.id, username: user.username, email: user.email };
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "6h" });
		return token;
	},

	async update(id: number, updates: Partial<IUser>): Promise<IUser> {
		const { text, values } = updateQuery("users", updates, { id });
		const result = await db.query(text, values);
		return result.rows[0];
	},

	async delete(id: number): Promise<void> {
		const { text, values } = deleteQuery("users", { id });
		await db.query(text, values);
	},
};
