import {
    Close,
    ExpandMore,
    PlaylistAdd,
    PlaylistAddCheck,
    Search,
} from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Loft } from "../../../../common/loft";
import { useSocket } from "../../hooks/socket";

const ExploreLoftsDialog = ({
    open,
    toggleDialog,
}: {
    open: boolean;
    toggleDialog: (isOpen: boolean) => void;
}) => {
    const socket = useSocket();

    const [searchedLofts, setSearchedLofts] = useState<Loft[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const joinLoft = (loftId: string) => {
        socket.emit("joinLoft", { loftId });
    };

    useEffect(() => {
        socket.emit("searchLofts", { query: searchQuery.trim().toLowerCase() });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    useEffect(() => {
        socket.on("loftsFound", (lofts: Loft[]) => {
            setSearchedLofts(lofts);
        });

        socket.on("loftJoined", (loft: Loft) => {
            console.log(loft);
            setSearchedLofts((prevLofts: Loft[]) =>
                prevLofts.map((prevLoft: Loft) =>
                    prevLoft.id === loft.id ? loft : prevLoft
                )
            );
        });

        socket.on("newLoftAvailable", (loft: Loft) => {
            setSearchedLofts((prevLofts: Loft[]) => [...prevLofts, loft]);
        });

        socket.on("queryError", () => {
            console.log("Query error");
        });

        return () => {
            socket.off("loftsFound");
            socket.off("loftJoined");
            socket.off("newLoftAvailable");
            socket.off("queryError");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Dialog open={open} maxWidth="sm" fullWidth fullScreen>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Explore lofts
                <IconButton onClick={() => toggleDialog(false)}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent
                dividers
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <TextField
                    id="explore-lofts-search"
                    label="Search"
                    size="small"
                    sx={{
                        width: { xs: "50%", md: "30%" },
                        mb: 3,
                    }}
                    margin="normal"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <label
                                        htmlFor="explore-lofts-search"
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
                {searchedLofts.length ? (
                    searchedLofts.map((loft: Loft) => (
                        <Accordion
                            key={loft.id}
                            sx={{ width: { xs: "70%", md: "50%" } }}
                        >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {loft.isMember ? (
                                        <PlaylistAddCheck
                                            color="info"
                                            fontSize="small"
                                        />
                                    ) : (
                                        <PlaylistAdd
                                            color="action"
                                            fontSize="small"
                                        />
                                    )}
                                    <Typography sx={{ ml: 1 }}>
                                        {loft.name}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    <Typography>Description</Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {loft.description}
                                    </Typography>
                                </Box>

                                {loft.isMember ? (
                                    <Typography>Joined</Typography>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={() => joinLoft(loft.id!)}
                                    >
                                        Join
                                    </Button>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    <Typography color="textSecondary">No loft found</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ExploreLoftsDialog;
