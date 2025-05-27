import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addConstraint('likes', 'liker_cannot_like_self', {
		check: 'liker_id <> liked_id',
	  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint('likes', 'liker_cannot_like_self');
}
