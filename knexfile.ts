import type { Knex } from "knex"
import dotenv from "dotenv"
import path from "path"

dotenv.config()

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(process.cwd(), process.env.DB_FILE_PATH as string),
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
  },
}

export default config