import { Grid2 } from "@mui/material";
import LoftWindow from "../components/LoftWindow";
import Sidebar from "../components/Sidebar";
import LoftProvider from "../contexts/Loft/LoftProvider";
import { SocketProvider } from "../contexts/Socket/SocketProvider";

// TODO Responsive design and divider?
const Lofts = () => {
    return (
        <SocketProvider>
            <LoftProvider>
                <Grid2 container sx={{ height: "100vh" }}>
                    <Grid2
                        size={{ xs: 4, md: 3 }}
                        sx={{ borderRight: "1px solid #ccc", height: "100%" }}
                    >
                        <Sidebar />
                    </Grid2>
                    <Grid2 size={{ xs: 8, md: 9 }} sx={{ height: "100%" }}>
                        <LoftWindow />
                    </Grid2>
                </Grid2>
            </LoftProvider>
        </SocketProvider>
    );
};

export default Lofts;
