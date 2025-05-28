import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	{
		// Safely drop the existing location column if it exists
		// pgm.dropColumn('profiles', 'location', { ifExists: true });
	  
		// Add new latitude and longitude columns
		pgm.addColumn('profiles', {
		  latitude: { type: 'double precision' },
		  longitude: { type: 'double precision' },
		});
	  }
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	// Remove latitude and longitude columns
	pgm.dropColumn('profiles', ['latitude', 'longitude']);
  
	// Optionally re-add the original location column (if needed)
	// pgm.addColumn('profiles', {
	//   location: { type: 'jsonb' }, // or use 'geometry' if PostGIS was used before
	// });
  }
