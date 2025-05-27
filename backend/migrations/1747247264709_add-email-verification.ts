import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	// 1. Add `email_verified` column to users table
	pgm.addColumn("users", {
		email_verified: {
			type: "boolean",
			notNull: true,
			default: false,
		},
	});

	// 2. Create `email_verification_tokens` table
	pgm.createTable("email_verification_tokens", {
		id: {
			type: "serial",
			primaryKey: true,
		},
		user_id: {
			type: "integer",
			notNull: true,
			references: "users(id)",
			onDelete: "CASCADE",
		},
		token: {
			type: "text",
			notNull: true,
			unique: true,
		},
		expires_at: {
			type: "timestamp",
			notNull: true,
		},
		created_at: {
			type: "timestamp",
			notNull: true,
			default: pgm.func("now()"),
		},
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	// Revert: Drop the tokens table and remove the column from users
	pgm.dropTable("email_verification_tokens");
	pgm.dropColumn("users", "email_verified");
}
