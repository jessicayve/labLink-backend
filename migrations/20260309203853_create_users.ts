import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.string("id").primary().notNullable().unique()
    table.string("name").notNullable()
    table.string("email").notNullable().unique()
    table.string("password").notNullable()
    table.string("role").notNullable()
    table.string("created_at").notNullable()
    table.string("updated_at").notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users")
}
