import { configDotenv } from "dotenv";
import postgres from "postgres";
import { Service } from "typedi";

@Service()
export class PostgresDbService {
    // Could have used node-postgres
    sql!: postgres.Sql;

    async connect() {
        // Postgre.js and SQL injections: https://github.com/porsager/postgres
        // Tagged templates: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
        configDotenv();
        const connectionString = process.env.DATABASE_URL;
        this.sql = postgres(connectionString!, { transform: postgres.toCamel });

        await this.testPostgresConnection();
        await this.createTables();
    }

    private async createTables() {
        console.log("Creating tables...");
        await this.sql`SET client_min_messages TO WARNING;`;

        await this.sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                full_name VARCHAR(100) NOT NULL,
                profile_pic_url TEXT
            );
        `;

        await this.sql`
            CREATE TABLE IF NOT EXISTS credentials (
                user_id UUID PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;

        await this.sql`
            CREATE TABLE IF NOT EXISTS lofts (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(100) NOT NULL UNIQUE,
                description VARCHAR(250),
                profile_pic_url TEXT,
                owner_id UUID NOT NULL,
                FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;

        await this.sql`
            CREATE TABLE IF NOT EXISTS loft_users (
                user_id UUID NOT NULL,
                loft_id UUID NOT NULL,
                PRIMARY KEY(user_id, loft_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (loft_id) REFERENCES lofts(id) ON DELETE CASCADE
            );
        `;

        await this.sql`
            CREATE TABLE IF NOT EXISTS messages (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                loft_id UUID NOT NULL,
                sender_id UUID NOT NULL,
                timestamp TIME NOT NULL,
                content VARCHAR(250),
                image_url TEXT,
                FOREIGN KEY (loft_id) REFERENCES lofts(id) ON DELETE CASCADE,
                FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;
        console.log("Tables created");
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
