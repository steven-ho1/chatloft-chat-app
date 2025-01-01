import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { useState } from "react";
import { Loft } from "../../../common/loft";
import { useSocket } from "../hooks/socket";
import CreateLoftDialog from "./CreateLoftDialog";

const CreateLoftButton = () => {
    const socket = useSocket();
    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    const createLoft = (newLoft: Loft) => {
        socket.emit("createLoft", newLoft);
    };

    return (
        <>
            <Fab size="small" onClick={openDialog}>
                <Add />
            </Fab>
            <CreateLoftDialog
                open={open}
                onClose={closeDialog}
                onSubmit={createLoft}
            ></CreateLoftDialog>
        </>
    );
};

export default CreateLoftButton;
