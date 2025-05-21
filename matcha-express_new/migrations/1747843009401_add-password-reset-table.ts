import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('password_resets', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    token_hash: {
      type: 'text',
      notNull: true,
    },
    expires_at: {
      type: 'timestamp with time zone',
      notNull: true,
    },
    used: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('password_resets', 'user_id');
  pgm.createIndex('password_resets', 'token_hash');
  pgm.createIndex('password_resets', ['user_id', 'used']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('password_resets');
}
