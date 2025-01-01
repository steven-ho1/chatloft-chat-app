/* eslint-disable react-hooks/exhaustive-deps */
import { Add } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Fab,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loft } from "../../../../common/loft";
import { useSocket } from "../../hooks/socket";
import UserMenu from "../UserMenu/UserMenu";
import "./LoftList.css";

const LoftList = ({
    activeLoft,
    setActiveLoft,
}: {
    activeLoft: Loft | null;
    setActiveLoft: React.Dispatch<React.SetStateAction<Loft | null>>;
}) => {
    const [userLofts, setUserLofts] = useState<Loft[]>([]);
    const [searchedLofts, setSearchedLofts] = useState<Loft[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const socket = useSocket();
    const navigate = useNavigate();

    const createLoft = () => {
        const loftName = prompt("Channel name");
        if (loftName?.trim().length) {
            const loft: Loft = {
                name: loftName,
                description: "",
                profilePicUrl: null,
            };

            socket.emit("createLoft", loft);
        }
    };

    const joinLoft = (loftId: string) => {
        socket.emit("joinLoft", { loftId });
    };

    const openLoft = (loft: Loft) => {
        setActiveLoft(loft);
        navigate(`/lofts/${loft.id}`);
    };

    useEffect(() => {
        socket.emit("searchLofts", { query: searchQuery.trim().toLowerCase() });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

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
            socket.off("queryError");
        };
    }, []);

    return (
        <div>
            <UserMenu />
            <Box
                sx={{
                    height: "100%",
                    overflowY: "auto",
                    backgroundColor: "#f4f4f4",
                    padding: 2,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Lofts
                </Typography>
                <Fab size="small" onClick={createLoft}>
                    <Add />
                </Fab>
                <List>
                    {userLofts.map((loft: Loft) => (
                        <ListItemButton
                            key={loft.id}
                            onClick={() => openLoft(loft)}
                            selected={activeLoft?.id === loft.id}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="Profile pic"
                                    src={loft.profilePicUrl!}
                                    sx={{ border: "1px solid #424242" }}
                                />
                            </ListItemAvatar>
                            <ListItemText primary={loft.name} />
                        </ListItemButton>
                    ))}
                </List>
                <h2>Chercher des lofts</h2>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
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
            </Box>
        </div>
    );
};

export default LoftList;

// https://medium.com/@kishorkrishna/cant-access-latest-state-inside-socket-io-listener-heres-how-to-fix-it-1522a5abebdb
