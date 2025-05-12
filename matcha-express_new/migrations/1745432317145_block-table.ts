import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable('blocks', {
	  blocker_id: {
		type: 'integer',
		notNull: true,
		references: 'users(id)', // foreign key to users
		onDelete: 'CASCADE',      // if a user is deleted, their blocks are also deleted
	  },
	  blocked_id: {
		type: 'integer',
		notNull: true,
		references: 'users(id)', // foreign key to users
		onDelete: 'CASCADE',      // if a user is deleted, their blocks are also deleted
	  },
	  created_at: {
		type: 'timestamp',
		notNull: true,
		default: pgm.func('now()'),  // default to current timestamp
	  },
	});
  
	// Add a composite primary key to ensure no duplicates (blocker and blocked pair must be unique)
	pgm.addConstraint('blocks', 'blocks_pkey', {
	  primaryKey: ['blocker_id', 'blocked_id'],
	});
  
	// Check constraint to prevent a user from blocking themselves
	pgm.addConstraint('blocks', 'blocker_not_blocked', {
	  check: 'blocker_id <> blocked_id',
	});
  
	// Optional: Create index on blocker_id and blocked_id for efficient querying
	pgm.createIndex('blocks', 'blocker_id');
	pgm.createIndex('blocks', 'blocked_id');
	pgm.createIndex('blocks', ['blocker_id', 'blocked_id']);

  };

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('blocks');
	pgm.dropConstraint('blocks', 'blocks_pkey');
	pgm.dropConstraint('blocks', 'blocker_not_blocked');
	pgm.dropIndex('blocks', 'blocker_id');
	pgm.dropIndex('blocks', 'blocked_id');
	pgm.dropIndex('blocks', ['blocker_id', 'blocked_id']);
}
