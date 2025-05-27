import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addColumn('profiles', {
	  avatar: {
		type: 'string',
		notNull: false, // Change to `true` if you want to require it
	  },
	});
  };

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropColumn('profiles', 'avatar');
  };
