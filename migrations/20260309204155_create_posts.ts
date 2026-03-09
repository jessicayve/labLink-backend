import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("posts", (table) => {
    table.string("id").primary().notNullable().unique()
    table.string("creator_id").notNullable()
    table.string("content").notNullable()
    table.integer("likes").notNullable().defaultTo(0)
    table.integer("dislikes").notNullable().defaultTo(0)
    table.integer("comments").notNullable().defaultTo(0)
    table.string("created_at").notNullable()
    table.string("updated_at").notNullable()

    table.foreign("creator_id").references("id").inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("posts")
}