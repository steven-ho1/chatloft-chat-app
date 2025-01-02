import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { useState } from "react";
import CreateLoftDialog from "./CreateLoftDialog";

const CreateLoftButton = () => {
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
                <Add />
            </Fab>
            {open && (
                <CreateLoftDialog
                    open={open}
                    onClose={closeDialog}
                ></CreateLoftDialog>
            )}
        </>
    );
};

export default CreateLoftButton;
