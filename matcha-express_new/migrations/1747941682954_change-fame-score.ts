import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.alterColumn("profiles", "fame_score", {
		default: 1,
	});
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.alterColumn("profiles", "fame_score", {
		default: 0,
	});
}
