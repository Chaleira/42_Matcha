import db from "../database/db";
import { insertQuery, selectWhere, updateQuery, deleteQuery } from "../database/sqlHelper";

export interface IReport {
	id?: number;
	reporter_id: number;
	reported_id: number;
	reason?: string;
	created_at?: Date;
};

export const reportModel = {
	async create(report: IReport): Promise<IReport> {
		const { text, values } = insertQuery<IReport>("reports", report);
		const result = await db.query(text, values);
		return result.rows[0];
	},

	async findById(id: number): Promise<IReport | null> {
		const { text, values } = selectWhere("reports", { id });
		const result = await db.query(text, values);
		return result.rows[0] || null;
	},

	async findByReporterAndReported(reporterId: number, reportedId: number): Promise<IReport | null> {
		const { text, values } = selectWhere("reports", { reporter_id: reporterId, reported_id: reportedId });
		const result = await db.query(text, values);
		return result.rows[0] || null;
	},

	async update(id: number, updates: Partial<IReport>): Promise<IReport> {
		const { text, values } = updateQuery("reports", updates, { id });
		const result = await db.query(text, values);
		return result.rows[0];
	},

	async delete(id: number): Promise<void> {
		const { text, values } = deleteQuery("reports", { id });
		await db.query(text, values);
	},
};