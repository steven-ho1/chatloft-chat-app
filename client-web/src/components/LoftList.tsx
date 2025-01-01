import {
    Avatar,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loft } from "../../../common/loft";
import { useLoft } from "../hooks/loft";
import { useSocket } from "../hooks/socket";

const LoftList = () => {
    const socket = useSocket();
    const { activeLoft, setActiveLoft } = useLoft();

    const [userLofts, setUserLofts] = useState<Loft[]>([]);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = useNavigate();

    const openLoft = (loft: Loft) => {
        setActiveLoft(loft);
        navigate(`/lofts/${loft.id}`);
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
            <TextField
                label="Search"
                size="small"
                margin="normal"
                fullWidth
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                }}
            />
            {userLofts.length ? (
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
            ) : (
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align={"center"}
                    mt={4}
                >
                    No loft joined
                </Typography>
            )}
        </div>
    );
};

export default LoftList;
