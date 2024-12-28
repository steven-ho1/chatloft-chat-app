import { Loft } from "@common/loft";
import { LoftManagementService } from "@src/services/loft-management.service";
import * as io from "socket.io";
import { Service } from "typedi";

@Service()
export class LoftHandler {
    constructor(private loftManagementService: LoftManagementService) {}

    setListeners(socket: io.Socket, sio: io.Server) {
        const { userId } = socket.handshake.auth;

        socket.on("createLoft", async (loft: Loft) => {
            try {
                const newLoft: Loft =
                    await this.loftManagementService.createLoft(loft, userId);
                socket.emit("loftCreated", newLoft);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("fetchUserLofts", async () => {
            try {
                const lofts: Loft[] =
                    await this.loftManagementService.fetchUserLofts(userId);

                sio.emit("userLoftsFetched", lofts);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("searchLofts", async (data: { query: string }) => {
            try {
                const query: string = data.query?.trim().toLowerCase();

                if (typeof query !== "string") {
                    socket.emit("queryError");
                    return;
                }

                const lofts: Loft[] =
                    await this.loftManagementService.searchLofts(query, userId);
                socket.emit("loftsFound", lofts);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("joinLoft", async (data: { loftId: string }) => {
            try {
                const loft: Loft = await this.loftManagementService.joinLoft(
                    userId,
                    data.loftId
                );

                socket.emit("loftJoined", loft);
            } catch (error) {
                console.log(error);
            }
        });
    }
}
