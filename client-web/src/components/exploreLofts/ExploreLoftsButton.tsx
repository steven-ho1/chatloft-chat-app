import { Explore } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { useState } from "react";
import ExploreLoftsDialog from "./ExploreLoftsDialog";

const ExploreLoftsButton = () => {
    const [open, setOpen] = useState(false);
    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <Fab size="small" onClick={openDialog}>
                <Explore />
            </Fab>
            {open && <ExploreLoftsDialog open={open} onClose={closeDialog} />}
        </>
    );
};

export default ExploreLoftsButton;
