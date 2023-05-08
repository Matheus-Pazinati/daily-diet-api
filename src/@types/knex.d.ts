import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
    },
    meals: {
      id: string
      name: string
      description: string
      meal_date: number
      on_diet: boolean
      user_id: string
    }
  }
}