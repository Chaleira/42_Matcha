import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	// 1. Add columns to profiles
	pgm.addColumn('profiles', {
	  first_name: { type: 'text', notNull: true, default: '' },
	  last_name: { type: 'text', notNull: true, default: '' },
	});
  
	// 2. Backfill data from users
	pgm.sql(`
	  UPDATE profiles
	  SET first_name = users.first_name,
		  last_name = users.last_name
	  FROM users
	  WHERE profiles.user_id = users.id;
	`);
  
	// 3. Remove default
	pgm.alterColumn('profiles', 'first_name', { default: null });
	pgm.alterColumn('profiles', 'last_name', { default: null });
  
	// 4. Sync users → profiles on update
	pgm.sql(`
	  CREATE OR REPLACE FUNCTION sync_user_name_to_profile()
	  RETURNS TRIGGER AS $$
	  BEGIN
		UPDATE profiles
		SET first_name = NEW.first_name,
			last_name = NEW.last_name
		WHERE user_id = NEW.id;
		RETURN NEW;
	  END;
	  $$ LANGUAGE plpgsql;
  
	  CREATE TRIGGER trg_sync_user_name_to_profile
	  AFTER UPDATE OF first_name, last_name ON users
	  FOR EACH ROW
	  WHEN (OLD.first_name IS DISTINCT FROM NEW.first_name OR OLD.last_name IS DISTINCT FROM NEW.last_name)
	  EXECUTE FUNCTION sync_user_name_to_profile();
	`);
  
	// 5. Sync profiles → users on update
	pgm.sql(`
	  CREATE OR REPLACE FUNCTION sync_profile_name_to_user()
	  RETURNS TRIGGER AS $$
	  BEGIN
		UPDATE users
		SET first_name = NEW.first_name,
			last_name = NEW.last_name
		WHERE id = NEW.user_id;
		RETURN NEW;
	  END;
	  $$ LANGUAGE plpgsql;
  
	  CREATE TRIGGER trg_sync_profile_name_to_user
	  AFTER UPDATE OF first_name, last_name ON profiles
	  FOR EACH ROW
	  WHEN (OLD.first_name IS DISTINCT FROM NEW.first_name OR OLD.last_name IS DISTINCT FROM NEW.last_name)
	  EXECUTE FUNCTION sync_profile_name_to_user();
	`);
  
	// 6. Auto-fill names from users on profile insert
	pgm.sql(`
	  CREATE OR REPLACE FUNCTION set_profile_name_from_user()
	  RETURNS TRIGGER AS $$
	  BEGIN
		SELECT u.first_name, u.last_name
		INTO NEW.first_name, NEW.last_name
		FROM users u
		WHERE u.id = NEW.user_id;
  
		RETURN NEW;
	  END;
	  $$ LANGUAGE plpgsql;
  
	  CREATE TRIGGER trg_set_profile_name_from_user
	  BEFORE INSERT ON profiles
	  FOR EACH ROW
	  EXECUTE FUNCTION set_profile_name_from_user();
	`);
  };

export async function down(pgm: MigrationBuilder): Promise<void> {
	// Drop all triggers and functions
	pgm.sql(`
	  DROP TRIGGER IF EXISTS trg_sync_user_name_to_profile ON users;
	  DROP FUNCTION IF EXISTS sync_user_name_to_profile;
  
	  DROP TRIGGER IF EXISTS trg_sync_profile_name_to_user ON profiles;
	  DROP FUNCTION IF EXISTS sync_profile_name_to_user;
  
	  DROP TRIGGER IF EXISTS trg_set_profile_name_from_user ON profiles;
	  DROP FUNCTION IF EXISTS set_profile_name_from_user;
	`);
  
	// Drop profile name columns
	pgm.dropColumns('profiles', ['first_name', 'last_name']);
  };
