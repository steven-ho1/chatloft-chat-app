import { configDotenv } from "dotenv";
import * as http from "http";
import { Service } from "typedi";
import { Application } from "./app";
import { PostgresDbService } from "./services/postgres-db.service";
import { SocketService } from "./services/socket/socket.service";
import { SupabaseService } from "./services/supabase.service";
import { LOCAL_PORT } from "./types/defaults";

@Service()
export class Server {
    private port: string;
    private server: http.Server;

    constructor(
        private application: Application,
        private socketService: SocketService,
        private postgreDb: PostgresDbService,
        private supabaseService: SupabaseService
    ) {
        configDotenv();
        this.port = process.env.PORT || LOCAL_PORT;
        this.server = http.createServer(this.application.app);
    }

    async init() {
        try {
            console.log(`\x1b[38;5;214m---Initializing server---\x1b[0m`);

            await this.postgreDb.connect();
            await this.supabaseService.connect();
            this.socketService.initSocketServer(this.server);
            this.listen();
        } catch (error) {
            console.error("Failed to start server:", error);
        }
    }

    private listen() {
        console.log("Launching server...");
        this.server.listen(this.port, () => {
            console.log(
                `\x1b[32m---Server is now listening on port ${this.port}---\x1b[0m`
            );
            console.log("Ready");
        });
    }
}
