import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.alterColumn('users', 'username', {
	  notNull: true
	});
	pgm.addConstraint('users', 'username_not_empty', 'CHECK (char_length(trim(username)) > 0)');
  
	pgm.alterColumn('users', 'email', {
	  notNull: true
	});
	pgm.addConstraint('users', 'email_not_empty', 'CHECK (char_length(trim(email)) > 0)');
  
	pgm.alterColumn('users', 'first_name', {
	  notNull: true
	});
	pgm.addConstraint('users', 'first_name_not_empty', 'CHECK (char_length(trim(first_name)) > 0)');
	
	pgm.alterColumn('users', 'last_name', {
	  notNull: true
	});
	pgm.addConstraint('users', 'last_name_not_empty', 'CHECK (char_length(trim(last_name)) > 0)');
	
	pgm.alterColumn('users', 'password', {
	  notNull: true
	});
	pgm.addConstraint('users', 'password_not_empty', 'CHECK (char_length(trim(password)) > 0)');
	// Add for other fields as needed...
  };

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint('users', 'username_not_empty');
	pgm.dropConstraint('users', 'email_not_empty');
	pgm.dropConstraint('users', 'first_name_not_empty');
	pgm.dropConstraint('users', 'last_name_not_empty');
	pgm.dropConstraint('users', 'password_not_empty');
	// Drop for other fields as needed...
}
