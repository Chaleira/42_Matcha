import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createIndex('likes', 'liker_id');
	pgm.createIndex('likes', 'liked_id');
	pgm.createIndex('likes', ['liker_id', 'liked_id']);

	pgm.createIndex('matches', 'user1_id');
	pgm.createIndex('matches', 'user2_id');
	pgm.createIndex('matches', ['user1_id', 'user2_id']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropIndex('likes', 'liker_id');
	pgm.dropIndex('likes', 'liked_id');
	pgm.dropIndex('likes', ['liker_id', 'liked_id']);

	pgm.dropIndex('matches', 'user1_id');
	pgm.dropIndex('matches', 'user2_id');
	pgm.dropIndex('matches', ['user1_id', 'user2_id']);
}
