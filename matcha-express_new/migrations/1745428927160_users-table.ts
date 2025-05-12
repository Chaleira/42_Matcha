import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("users", {
		id: {
			type: "serial",
			primaryKey: true,
			notNull: true,
		},
		username: {
			type: "varchar(50)",
			notNull: true,
			unique: true,
		},
		email: {
			type: "varchar(100)",
			notNull: true,
			unique: true,
		},
		first_name: {
			type: "varchar(50)",
			notNull: true,
		},
		last_name: {
			type: "varchar(50)",
			notNull: true,
		},
		password: {
			type: "varchar(255)",
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
	pgm.dropTable("users");
}
