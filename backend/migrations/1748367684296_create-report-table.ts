import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('reports', {
    id: 'id',
    reporter_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    reported_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    reason: {
      type: 'text',
      notNull: false,
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
  });

  // Prevent duplicate reports
  pgm.addConstraint('reports', 'unique_reporter_reported_pair', {
    unique: ['reporter_id', 'reported_id'],
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('reports');
}
