import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable('messages', {
	  sender_id: {
		type: 'integer',
		notNull: true,
		references: 'users(id)', // foreign key to users
		onDelete: 'CASCADE',      // if a user is deleted, messages sent by them are also deleted
	  },
	  receiver_id: {
		type: 'integer',
		notNull: true,
		references: 'users(id)', // foreign key to users
		onDelete: 'CASCADE',      // if a user is deleted, messages received by them are also deleted
	  },
	  text: {
		type: 'text',
		notNull: true,  // assuming all messages must have content
	  },
	  created_at: {
		type: 'timestamp',
		notNull: true,
		default: pgm.func('now()'),  // default to current timestamp
	  },
	});
  
	// Add a composite primary key for (sender_id, receiver_id, created_at)
	pgm.addConstraint('messages', 'messages_pkey', {
	  primaryKey: ['sender_id', 'receiver_id', 'created_at'],
	});
  
	pgm.addConstraint('messages', 'sender_not_receiver', {
		check: 'sender_id <> receiver_id',
	  });

	// You could also add indexes for faster querying by sender and receiver
	pgm.createIndex('messages', 'sender_id');
	pgm.createIndex('messages', 'receiver_id');
  };

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('messages');
	pgm.dropConstraint('messages', 'messages_pkey');
	pgm.dropConstraint('messages', 'sender_not_receiver');
	pgm.dropIndex('messages', 'sender_id');
	pgm.dropIndex('messages', 'receiver_id');
}
