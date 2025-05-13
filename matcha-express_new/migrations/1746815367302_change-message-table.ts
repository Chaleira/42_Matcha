import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	// Create chats table
	pgm.createTable("chats", {
		id: "id",
		user1_id: {
			type: "integer",
			notNull: true,
			references: "users(id)",
			onDelete: "CASCADE",
		},
		user2_id: {
			type: "integer",
			notNull: true,
			references: "users(id)",
			onDelete: "CASCADE",
		},
		created_at: {
			type: "timestamp",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
	});

	// Enforce uniqueness on normalized user pairs
	pgm.addConstraint("chats", "chats_users_order_check", {
		check: "user1_id < user2_id",
	});

	// Enforce uniqueness on ordered pairs
	pgm.addConstraint("chats", "chats_unique_pair", {
		unique: ["user1_id", "user2_id"],
	});

	// Create messages table
	pgm.createTable("messages", {
		id: "id",
		chat_id: {
			type: "integer",
			notNull: true,
			references: "chats(id)",
			onDelete: "CASCADE",
		},
		sender_id: {
			type: "integer",
			notNull: true,
			references: "users(id)",
			onDelete: "CASCADE",
		},
		text: {
			type: "text",
			notNull: true,
		},
		is_read: {
			type: "boolean",
			notNull: true,
			default: false,
		},
		created_at: {
			type: "timestamp",
			notNull: true,
			default: pgm.func("current_timestamp"),
		},
	});

	pgm.createIndex("messages", ["chat_id"]);
	pgm.createIndex("messages", ["sender_id"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable("messages");
	pgm.dropTable("chats");
}
