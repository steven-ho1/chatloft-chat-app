import { Explore } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { useState } from "react";
import ExploreLoftsDialog from "./ExploreLoftsDialog";

const ExploreLoftsButton = () => {
    const [open, setOpen] = useState(false);

    const toggleDialog = (isOpen: boolean) => {
        setOpen(isOpen);
    };

    return (
        <>
            <Fab size="small" onClick={() => toggleDialog(true)}>
                <Explore />
            </Fab>
            {open && (
                <ExploreLoftsDialog open={open} toggleDialog={toggleDialog} />
            )}
        </>
    );
};

export default ExploreLoftsButton;
