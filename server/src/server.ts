import { configDotenv } from "dotenv";
import { Service } from "typedi";
import { Application } from "./app";
import { PostgresDb } from "./services/postgres-db.service";

@Service()
export class Server {
    private port: number = 5000;

    constructor(
        private application: Application,
        private postgreDb: PostgresDb
    ) {
        this.config();
    }

    async init() {
        try {
            console.log(`\x1b[38;5;214m---Initializing server---\x1b[0m`);
            await this.postgreDb.connect();

            this.listen();
        } catch (error) {
            console.error("Failed to start server:", error);
        }
    }

    private config() {
        configDotenv();
        this.port = Number(process.env.PORT) || this.port;
    }

    private listen() {
        this.application.app.listen(this.port, () => {
            console.log(`\x1b[32m---Listening on port ${this.port}---\x1b[0m`);
            console.log("Ready");
        });
    }
}
