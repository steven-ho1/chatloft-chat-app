import { Box, Grid2, Typography } from "@mui/material";
import CreateLoftButton from "./createLoft/CreateLoftButton";
import ExploreLoftsButton from "./exploreLofts/ExploreLoftsButton";
import LoftList from "./LoftList";
import UserMenu from "./UserMenu";

const Sidebar = () => {
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
            </Box>
        </Box>
    );
};

export default Sidebar;

// https://medium.com/@kishorkrishna/cant-access-latest-state-inside-socket-io-listener-heres-how-to-fix-it-1522a5abebdb
