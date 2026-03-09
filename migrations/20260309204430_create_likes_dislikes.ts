import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("likes_dislikes", (table) => {
    table.string("user_id").notNullable()
    table.string("post_id").notNullable()
    table.integer("like").notNullable()

    table.primary(["user_id", "post_id"])

    table.foreign("user_id").references("id").inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")

    table.foreign("post_id").references("id").inTable("posts")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("likes_dislikes")
}
