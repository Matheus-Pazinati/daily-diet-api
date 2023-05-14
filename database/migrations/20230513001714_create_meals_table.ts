import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').notNullable().primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.integer('meal_date').notNullable()
    table.boolean('on_diet').notNullable()
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete("CASCADE")
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

