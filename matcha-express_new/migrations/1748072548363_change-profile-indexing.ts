import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Index on latitude and longitude for location filtering
  pgm.createIndex('profiles', ['latitude', 'longitude'], {
    name: 'idx_profiles_lat_lng',
  });

  // Index on fame_score for sorting
  pgm.createIndex('profiles', 'fame_score', {
    name: 'idx_profiles_fame_score',
  });

  // GIN index on tags array for fast overlap queries
  pgm.sql(`
    CREATE INDEX idx_profiles_tags_gin ON profiles USING GIN (tags);
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('profiles', ['latitude', 'longitude'], {
    name: 'idx_profiles_lat_lng',
  });

  pgm.dropIndex('profiles', 'fame_score', {
    name: 'idx_profiles_fame_score',
  });

  pgm.sql(`
    DROP INDEX IF EXISTS idx_profiles_tags_gin;
  `);
}
