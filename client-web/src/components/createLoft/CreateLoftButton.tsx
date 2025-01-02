import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { useState } from "react";
import CreateLoftDialog from "./CreateLoftDialog";

const CreateLoftButton = () => {
    const [open, setOpen] = useState(false);

    const toggleDialog = (isOpen: boolean) => {
        setOpen(isOpen);
    };
    return (
        <>
            <Fab size="small" onClick={() => toggleDialog(true)}>
                <Add />
            </Fab>
            {open && (
                <CreateLoftDialog
                    open={open}
                    toggleDialog={toggleDialog}
                ></CreateLoftDialog>
            )}
        </>
    );
};

export default CreateLoftButton;
