import { Loft } from "@common/loft";
import * as io from "socket.io";
import { Service } from "typedi";
import { LoftManagementService } from "./loft-management.service";

@Service()
export class SocketService {
    private sio!: io.Server;

    constructor(private loftManagementService: LoftManagementService) {}

    initSocketServer(server: Express.Application) {
        this.sio = new io.Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.handleEvents();
    }

    handleEvents() {
        this.sio.use((socket, next) => {
            const { userId } = socket.handshake.auth;

            if (userId) {
                console.log("User connected:", userId);
                return next();
            }
            console.log("No userId");
        });

        this.sio.on("connection", (socket) => {
            const { userId } = socket.handshake.auth;

            socket.on("sendMessage", (message) => {
                socket.emit("newMessage", message);
            });

            socket.on("createLoft", async (loft: Loft) => {
                try {
                    const newLoft: Loft =
                        await this.loftManagementService.createLoft(
                            loft,
                            userId
                        );
                    this.sio.emit("loftCreated", newLoft);
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on("fetchUserLofts", async () => {
                try {
                    const lofts: Loft[] =
                        await this.loftManagementService.getUserLofts(userId);

                    this.sio.emit("userLoftsFetched", lofts);
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on("getAllLofts", async () => {
                try {
                } catch (error) {
                    console.log(error);
                }
            });
        });
    }
}
