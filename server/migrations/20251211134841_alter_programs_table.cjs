exports.up = async function(knex) {
  // Create program_categories if not exists
  const hasProgramCategories = await knex.schema.hasTable("program_categories");
  if (!hasProgramCategories) {
    await knex.schema.createTable("program_categories", (table) => {
      table.increments("category_id").primary();
      table.string("name", 255).notNullable();
      table.timestamps(true, true);
    });
  }

  // Alter programs table to add missing fields
  const hasPrograms = await knex.schema.hasTable("programs");
  if (hasPrograms) {
    // Check each column before adding
    const columns = await knex("programs").columnInfo();

    if (!columns.category_id) {
      await knex.schema.alterTable("programs", (table) => {
        table
          .integer("category_id")
          .unsigned()
          .references("category_id")
          .inTable("program_categories")
          .onDelete("CASCADE");
      });
    }

    if (!columns.organization_id) {
      await knex.schema.alterTable("programs", (table) => {
        table
          .integer("organization_id")
          .unsigned()
          .references("id")
          .inTable("organizations")
          .onDelete("SET NULL");
      });
    }

    if (!columns.date) {
      await knex.schema.alterTable("programs", (table) => {
        table.date("date");
      });
    }

    if (!columns.time) {
      await knex.schema.alterTable("programs", (table) => {
        table.time("time");
      });
    }

    if (!columns.venue) {
      await knex.schema.alterTable("programs", (table) => {
        table.string("venue", 255);
      });
    }

    if (!columns.agenda) {
      await knex.schema.alterTable("programs", (table) => {
        table.text("agenda");
      });
    }

    if (!columns.status) {
      await knex.schema.alterTable("programs", (table) => {
        table.string("status", 50).defaultTo("Upcoming");
      });
    }

    if (!columns.event_type) {
      await knex.schema.alterTable("programs", (table) => {
        table.string("event_type", 255);
      });
    }

    if (!columns.notes) {
      await knex.schema.alterTable("programs", (table) => {
        table.text("notes");
      });
    }
  }
};

exports.down = async function(knex) {
  const hasPrograms = await knex.schema.hasTable("programs");
  if (hasPrograms) {
    await knex.schema.alterTable("programs", (table) => {
      const cols = [
        "category_id",
        "organization_id",
        "date",
        "time",
        "venue",
        "agenda",
        "status",
        "event_type",
        "notes",
      ];
      cols.forEach((col) => {
        table.dropColumn(col);
      });
    });
  }
};
