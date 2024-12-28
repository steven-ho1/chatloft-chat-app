import { useEffect, useState } from "react";
import { Loft } from "../../../../common/loft";
import { useSocket } from "../../hooks/socket";

const ChatList = () => {
    const [userLofts, setUserLofts] = useState<Loft[]>([]);
    const socket = useSocket();
    const createLoft = () => {
        const loftName = prompt("Channel name");
        if (loftName?.trim().length) {
            const loft: Loft = {
                name: loftName,
                description: "",
                profilePicUrl: "",
            };

            socket.emit("createLoft", loft);
        }
    };

    useEffect(() => {
        socket.on("loftCreated", (loft: Loft) => {
            setUserLofts((prevLofts) => [...prevLofts, loft]);
        });

        socket.on("userLoftsFetched", (lofts: Loft[]) => {
            setUserLofts(lofts);
        });

        socket.emit("fetchUserLofts");

        return () => {
            socket.off("loftCreated");
            socket.off("userLoftsFetched");
        };
    }, []);

    return (
        <div>
            <button onClick={createLoft}>Create Loft</button>
            <h2>Lofts</h2>
            <ul>
                {userLofts.map((loft: Loft) => (
                    <li key={loft.id}>{loft.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;

// https://medium.com/@kishorkrishna/cant-access-latest-state-inside-socket-io-listener-heres-how-to-fix-it-1522a5abebdb
