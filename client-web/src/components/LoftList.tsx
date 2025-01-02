import { Search } from "@mui/icons-material";
import {
    Avatar,
    InputAdornment,
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

const DEBOUNCE_DELAY = 300;

const LoftList = () => {
    const socket = useSocket();
    const { activeLoft, setActiveLoft } = useLoft();

    const [userLofts, setUserLofts] = useState<Loft[]>([]);
    const [filteredLofts, setFilteredLofts] = useState<Loft[]>([]);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            const words: string[] = searchQuery
                .trim()
                .toLowerCase()
                .split(/\s+/);

            const loftsFound: Loft[] = userLofts.filter((loft: Loft) =>
                words.every((word: string) =>
                    loft.name.toLowerCase().includes(word)
                )
            );

            setFilteredLofts(loftsFound);
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [userLofts, searchQuery]);

    return (
        <div>
            <TextField
                id="search"
                label="Search"
                size="small"
                margin="normal"
                fullWidth
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <label
                                    htmlFor="search"
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    <Search />
                                </label>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            {filteredLofts.length ? (
                <List>
                    {filteredLofts.map((loft: Loft) => (
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
