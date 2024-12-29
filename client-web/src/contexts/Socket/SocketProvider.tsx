import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "../../hooks/user";
import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { user } = useUser();

    useEffect(() => {
        const socketConnection = io(import.meta.env.VITE_API_URL, {
            auth: { userId: user!.id },
        });
        setSocket(socketConnection);

        return () => {
            socketConnection.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!socket) {
        return;
    }

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
