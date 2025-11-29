GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO chile;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO chile;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chile;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO chile;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO chile;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO chile;

-- Ensure future tables/sequences are also accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chile;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO chile;
GRANT ALL PRIVILEGES ON DATABASE shield_db TO chile;


psql -U chile -d shield_db

//migrate using knex migration tool
npx knex migrate:latest

or

npx knex migrate:latest --knexfile knexfile.cjs

//rollback command
npx knex migrate:rollback

or 

npx knex migrate:rollback --knexfile knexfile.cjs


//seeding data to tables

npx knex migrate:make seed_core_tables

//creating a new migration file

npx knex --knexfile knexfile.cjs migrate:make add_org_extra_fields

npx knex migrate:make add_org_extra_fields


npx knex --knexfile knexfile.cjs migrate:make update_programs_add_fk


//check status of the version of the migrations

npx knex --knexfile knexfile.cjs migrate:status


