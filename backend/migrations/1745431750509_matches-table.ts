import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable('matches', {
		user1_id: {
		  type: 'integer',
		  notNull: true,
		  references: 'users(id)',
		  onDelete: 'CASCADE',
		},
		user2_id: {
		  type: 'integer',
		  notNull: true,
		  references: 'users(id)',
		  onDelete: 'CASCADE',
		},
		created_at: {
		  type: 'timestamp',
		  notNull: true,
		  default: pgm.func('now()'),
		},
	  });
	  
	  // Ensure user1_id < user2_id to keep match direction consistent
	  pgm.addConstraint('matches', 'matches_users_order_check', {
		check: 'user1_id < user2_id',
	  });
	  
	  // Primary key to prevent duplicate matches
	  pgm.addConstraint('matches', 'matches_pkey', {
		primaryKey: ['user1_id', 'user2_id'],
	  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('matches');
	pgm.dropConstraint('matches', 'matches_users_order_check');
	pgm.dropConstraint('matches', 'matches_pkey');
}
