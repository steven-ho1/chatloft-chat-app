import { useEffect, useState } from "react";
import { Loft } from "../../../../common/loft";
import { useSocket } from "../../hooks/socket";

const ChatList = () => {
    const [userLofts, setUserLofts] = useState<Loft[]>([]);
    const [searchedLofts, setSearchedLofts] = useState<Loft[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
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

    const searchLoft = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        console.log(typeof query);
        socket.emit("searchLofts", { query: query.trim().toLowerCase() });
    };

    const joinLoft = (loftId: string) => {
        socket.emit("joinLoft", { loftId });
    };

    const openLoft = () => {};

    useEffect(() => {
        socket.on("loftCreated", (loft: Loft) => {
            setUserLofts((prevLofts) => [...prevLofts, loft]);
        });

        socket.on("userLoftsFetched", (lofts: Loft[]) => {
            setUserLofts(lofts);
        });

        // TODO Put in dialog box
        socket.on("loftsFound", (lofts: Loft[]) => {
            setSearchedLofts(lofts);
        });

        socket.on("queryError", () => {
            alert("Query error");
        });

        socket.on("loftJoined", (loft: Loft) => {
            setSearchedLofts((prevLofts) =>
                prevLofts.map((prevLoft: Loft) =>
                    prevLoft.id === loft.id
                        ? { ...prevLoft, isMember: true }
                        : prevLoft
                )
            );

            setUserLofts((prevLofts) => [...prevLofts, loft]);
        });

        socket.emit("fetchUserLofts");

        return () => {
            socket.off("loftCreated");
            socket.off("userLoftsFetched");
            socket.off("loftsFound");
            socket.off("loftJoined");
        };
    }, []);

    return (
        <div>
            <button onClick={createLoft}>Create Loft</button>
            <h2>Lofts</h2>
            <ul>
                {userLofts.map((loft: Loft) => (
                    <li key={loft.id} onClick={openLoft}>
                        {loft.name}
                    </li>
                ))}
            </ul>
            <h2>Chercher des lofts</h2>
            <input type="text" value={searchQuery} onChange={searchLoft} />
            <ul>
                {searchedLofts.map((loft: Loft) => (
                    <li key={loft.id}>
                        {loft.name}{" "}
                        {loft.isMember ? (
                            <span>Joined</span>
                        ) : (
                            <button onClick={() => joinLoft(loft.id!)}>
                                Join
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;

// https://medium.com/@kishorkrishna/cant-access-latest-state-inside-socket-io-listener-heres-how-to-fix-it-1522a5abebdb
