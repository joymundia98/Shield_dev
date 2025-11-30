exports.up = async function seed(knex) {
  // Clear existing rows
  await knex("departments").del();

  // Insert seed data
  await knex("departments").insert([
    {
      name: "IT Department",
      description: "Handles software, hardware, and technical operations",
      category: "corporate"
    },
    {
      name: "Finance Department",
      description: "Manages budgeting, payments, and financial reporting",
      category: "church"
    },
    {
      name: "Human Resources Department",
      description: "Responsible for recruitment, welfare, and staff management",
      category: "church"
    },
    {
      name: "Operations Department",
      description: "Oversees general business operations",
      category: "corporate"
    }
  ]);
}

exports.down = async function (knex) {
  // Rollback = clear inserted departments
  await knex("departments").del();
};
