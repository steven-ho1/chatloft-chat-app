/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid2, Typography } from "@mui/material";
import CreateLoftButton from "./CreateLoftButton";
import ExploreLoftsButton from "./ExploreLoftsButton";
import LoftList from "./LoftList";
import UserMenu from "./UserMenu";

const Sidebar = () => {
    // const [searchedLofts, setSearchedLofts] = useState<Loft[]>([]);
    // const [searchQuery, setSearchQuery] = useState<string>("");

    // const joinLoft = (loftId: string) => {
    //     socket.emit("joinLoft", { loftId });
    // };

    // useEffect(() => {
    //     socket.emit("searchLofts", { query: searchQuery.trim().toLowerCase() });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [searchQuery]);

    // useEffect(() => {
    //     // TODO Put in dialog box
    //     // socket.on("loftsFound", (lofts: Loft[]) => {
    //     //     setSearchedLofts(lofts);
    //     // });

    //     // socket.on("queryError", () => {
    //     //     alert("Query error");
    //     // });

    //     // socket.on("loftJoined", (loft: Loft) => {
    //     //     setSearchedLofts((prevLofts) =>
    //     //         prevLofts.map((prevLoft: Loft) =>
    //     //             prevLoft.id === loft.id
    //     //                 ? { ...prevLoft, isMember: true }
    //     //                 : prevLoft
    //     //         )
    //     //     );

    //     //     setUserLofts((prevLofts) => [...prevLofts, loft]);
    //     // });

    //     return () => {
    //         socket.off("loftsFound");
    //         socket.off("loftJoined");
    //         socket.off("queryError");
    //     };
    // }, []);

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <UserMenu />
            <Box
                sx={{
                    bgcolor: "grey.100",
                    padding: 2,
                    flex: 1,
                }}
            >
                <Grid2 container columnSpacing={3}>
                    <Grid2 sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="h6">My Lofts</Typography>
                    </Grid2>
                    <Grid2 sx={{ display: "flex", gap: 1 }}>
                        <CreateLoftButton />
                        <ExploreLoftsButton />
                    </Grid2>
                </Grid2>
                <LoftList />

                {/* <h2>Chercher des lofts</h2>
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
                </ul> */}
            </Box>
        </Box>
    );
};

export default Sidebar;

// https://medium.com/@kishorkrishna/cant-access-latest-state-inside-socket-io-listener-heres-how-to-fix-it-1522a5abebdb
