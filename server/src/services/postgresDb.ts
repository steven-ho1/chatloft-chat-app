import { configDotenv } from "dotenv";
import postgres from "postgres";
import { Service } from "typedi";

@Service()
export class PostgresDb {
    // Could have used node-postgres
    sql!: postgres.Sql;

    async connect() {
        // Postgre.js and SQL injections: https://github.com/porsager/postgres
        // Tagged templates: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
        configDotenv();
        const connectionString = process.env.DATABASE_URL;
        this.sql = postgres(connectionString!);

        await this.testPostgresConnection();
        await this.setTables();
    }

    private async setTables() {
        await this.sql`SET client_min_messages TO WARNING;`;

        await this.sql`
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    full_name VARCHAR(255) NOT NULL,
                    profile_pic TEXT NOT NULL
                );
            `;

        await this.sql`
                CREATE TABLE IF NOT EXISTS credentials (
                    user_id TEXT PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                );
            `;
    }

    private async testPostgresConnection() {
        try {
            await this.sql`SELECT 1 AS "testConnection"`;
            console.log("Database connected");
        } catch (err) {
            console.error("Error connecting to the database:", err);
            process.exit(1);
        }
    }
}
