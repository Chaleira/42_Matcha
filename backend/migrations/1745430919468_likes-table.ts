import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable("likes", {
		liker_id: {
			type: "integer",
			notNull: true,
			references: "users(id)",
			onDelete: "CASCADE",
		},
		liked_id: {
			type: "integer",
			notNull: true,
			references: "users(id)",
			onDelete: "CASCADE",
		},
		created_at: {
			type: "timestamp",
			notNull: true,
			default: pgm.func("now()"),
		},
	});

	pgm.addConstraint("likes", "likes_pkey", {
		primaryKey: ["liker_id", "liked_id"],
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('likes');
	pgm.dropConstraint('likes', 'likes_pkey');
	
}
