import { configDotenv } from "dotenv";
import * as http from "http";
import { Service } from "typedi";
import { Application } from "./app";
import { PostgresDbService } from "./services/postgres-db.service";
import { SocketService } from "./services/socket/socket.service";

@Service()
export class Server {
    private port: number = 5000;
    private server: http.Server;

    constructor(
        private application: Application,
        private socketService: SocketService,
        private postgreDb: PostgresDbService
    ) {
        configDotenv();
        this.port = Number(process.env.PORT) || this.port;
        this.server = http.createServer(this.application.app);
    }

    async init() {
        try {
            console.log(`\x1b[38;5;214m---Initializing server---\x1b[0m`);
            await this.postgreDb.connect();
            this.socketService.initSocketServer(this.server);

            this.listen();
        } catch (error) {
            console.error("Failed to start server:", error);
        }
    }

    private listen() {
        this.server.listen(this.port, () => {
            console.log(`\x1b[32m---Listening on port ${this.port}---\x1b[0m`);
            console.log("Ready");
        });
    }
}
