import { Grid2 } from "@mui/material";
import { useState } from "react";
import { Loft } from "../../../../common/loft";
import LoftList from "../../components/LoftList/LoftList";
import LoftWindow from "../../components/LoftWindow/LoftWindow";
import { SocketProvider } from "../../contexts/Socket/SocketProvider";
import "./Lofts.css";

// TODO Responsive design and divider?
const Lofts = () => {
    const [activeLoft, setActiveLoft] = useState<Loft | null>(null);

    return (
        <SocketProvider>
            <Grid2 container sx={{ height: "100vh" }}>
                <Grid2
                    size={{ xs: 4, md: 3 }}
                    sx={{ borderRight: "1px solid #ccc", height: "100%" }}
                >
                    <LoftList
                        activeLoft={activeLoft}
                        setActiveLoft={setActiveLoft}
                    />
                </Grid2>
                <Grid2 size={{ xs: 8, md: 9 }} sx={{ height: "100%" }}>
                    <LoftWindow activeLoft={activeLoft} />
                </Grid2>
            </Grid2>
        </SocketProvider>
    );
};

export default Lofts;
