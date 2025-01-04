import { Loft, LoftCreation } from "@common/loft";
import { Message } from "@common/message";
import { LoftManagementService } from "@src/services/loft-management.service";
import { MessageManagementService } from "@src/services/message-management.service";
import * as io from "socket.io";
import { Service } from "typedi";

@Service()
export class LoftHandler {
    constructor(
        private loftManagementService: LoftManagementService,
        private messageManagementService: MessageManagementService
    ) {}

    setListeners(socket: io.Socket, sio: io.Server) {
        const { userId } = socket.handshake.auth as { userId: string };
        let currentLoftId: string = "";

        socket.on("createLoft", async (loft: LoftCreation) => {
            try {
                const newLoft: Loft =
                    await this.loftManagementService.createLoft(loft, userId);

                socket.emit("newUserLoft", newLoft);

                newLoft.isMember = false;
                socket.broadcast.emit("newLoftAvailable", newLoft);
            } catch (error) {
                console.log("Error while creating loft\n", error);
            }
        });

        socket.on("fetchUserLofts", async () => {
            try {
                const lofts: Loft[] =
                    await this.loftManagementService.fetchUserLofts(userId);

                sio.emit("userLoftsFetched", lofts);
            } catch (error) {
                console.log("Error while fetching user lofts\n", error);
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
                console.log("Error while fetching searching lofts\n", error);
            }
        });

        socket.on("joinLoft", async (data: { loftId: string }) => {
            try {
                const loft: Loft = await this.loftManagementService.joinLoft(
                    userId,
                    data.loftId
                );

                loft.isMember = true;
                socket.emit("loftJoined", loft);
                socket.emit("newUserLoft", loft);
            } catch (error) {
                console.log("Error while joining loft\n", error);
            }
        });

        socket.on("enterLoft", async (data: { loftId: string }) => {
            try {
                const loftExists: boolean =
                    await this.loftManagementService.doesLoftExist(data.loftId);
                if (!loftExists) return;

                const messages: Message[] =
                    await this.messageManagementService.fetchLoftMessages(
                        data.loftId
                    );
                socket.emit("loftMessagesFetched", messages);
                socket.join(data.loftId);

                socket.leave(currentLoftId);
                currentLoftId = data.loftId;
            } catch (error) {
                console.log("Error while entering loft\n", error);
            }
        });
    }
}
