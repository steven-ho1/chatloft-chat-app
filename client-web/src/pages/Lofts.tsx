import { Grid2 } from "@mui/material";
import LoftWindow from "../components/LoftWindow";
import Sidebar from "../components/Sidebar";
import LoftProvider from "../contexts/loft/LoftProvider";
import { SocketProvider } from "../contexts/socket/SocketProvider";

const Lofts = () => {
    return (
        <SocketProvider>
            <LoftProvider>
                <Grid2 container sx={{ height: "100vh" }}>
                    <Grid2
                        size={{ xs: 4, md: 2.5 }}
                        sx={{ borderRight: "1px solid #ccc", height: "100%" }}
                    >
                        <Sidebar />
                    </Grid2>
                    <Grid2 size={{ xs: 8, md: 9.5 }} sx={{ height: "100%" }}>
                        <LoftWindow />
                    </Grid2>
                </Grid2>
            </LoftProvider>
        </SocketProvider>
    );
};

export default Lofts;
