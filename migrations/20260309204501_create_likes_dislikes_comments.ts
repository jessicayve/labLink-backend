import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("likes_dislikes_comments", (table) => {
    table.string("user_id").notNullable()
    table.string("comment_id").notNullable()
    table.integer("like").notNullable()

    table.primary(["user_id", "comment_id"])

    table.foreign("user_id").references("id").inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")

    table.foreign("comment_id").references("id").inTable("comments")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("likes_dislikes_comments")
}