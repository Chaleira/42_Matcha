import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable('notifications', {
		id: 'id',
		user_id: {
		  type: 'integer',
		  notNull: true,
		  references: 'users(id)',
		  onDelete: 'CASCADE',
		},
		triggered_by_id: {
		  type: 'integer',
		  references: 'users(id)',
		  onDelete: 'SET NULL',
		},
		type: {
		  type: 'text',
		  notNull: true,
		  check: `type IN ('match', 'like', 'visit', 'message', 'unlike')`,
		},
		content: {
		  type: 'text',
		  notNull: true,
		},
		seen: {
		  type: 'boolean',
		  notNull: true,
		  default: false,
		},
		created_at: {
		  type: 'timestamp',
		  notNull: true,
		  default: pgm.func('now()'),
		},
	  });

	  pgm.createIndex('notifications', 'user_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('notifications');
	pgm.dropIndex('notifications', 'user_id');
}
