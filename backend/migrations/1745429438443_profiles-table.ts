import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createExtension("postgis");
	pgm.createTable("profiles", {
		user_id: {
			type: "integer",
			primaryKey: true,
			references: "users(id)",
			onDelete: "CASCADE",
			notNull: true,
		},
		bio: {
			type: "text",
			notNull: false,
		},
		tags: {
			type: "text[]",
			notNull: false,
		},
		gender: {
			type: "varchar(50)",
			notNull: false,
		},
		sexual_preference: {
			type: "varchar(50)",
			notNull: false,
		},
		pictures: {
			type: "text[]",
			notNull: false,
		},
		fame_score: {
			type: "integer",
			notNull: true,
			default: 0,
		},
		location: {
			type: "geometry(Point, 4326)",
			notNull: false,
		},
		created_at: {
			type: "timestamp",
			notNull: true,
			default: pgm.func("now()"),
		},
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropExtension("postgis");
	pgm.dropTable("profiles");
}
