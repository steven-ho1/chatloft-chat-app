import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid2,
    TextField,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import { LoftCreation } from "../../../../common/loft";
import { useSocket } from "../../hooks/socket";
import { LIMITS } from "../../types/limits";

const CreateLoftDialog = ({
    open,
    toggleDialog,
}: {
    open: boolean;
    toggleDialog: (isOpen: boolean) => void;
}) => {
    const socket = useSocket();

    const [newLoft, setNewLoft] = useState<LoftCreation>({
        name: "",
        description: "",
        profilePicUrl: null,
    });

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewLoft((prev) => ({ ...prev, [name]: value }));
    };

    const createLoft = (newLoft: LoftCreation) => {
        socket.emit("createLoft", newLoft);
    };

    const handleSubmit = () => {
        createLoft(newLoft);
        toggleDialog(false);
    };

    const handleClosing = () => {
        toggleDialog(false);
    };

    return (
        <Dialog open={open} fullScreen={fullScreen}>
            <DialogTitle>Create a new loft</DialogTitle>
            <DialogContent dividers>
                <Grid2 container spacing={2}>
                    <Grid2
                        size="grow"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Avatar
                            sx={{ width: 80, height: 80 }}
                            src={newLoft.profilePicUrl || ""}
                        />
                        {newLoft.profilePicUrl ? (
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button>Modify</Button>
                                <Button color="error">Delete</Button>
                            </Box>
                        ) : (
                            <Button
                                onClick={() =>
                                    alert(
                                        "Not implemented yet, but the user profile pic change is"
                                    )
                                }
                            >
                                Upload
                            </Button>
                        )}
                    </Grid2>
                    <Divider orientation="vertical" flexItem />
                    <Grid2 size={8}>
                        <TextField
                            name="name"
                            label="Loft name"
                            fullWidth
                            margin="normal"
                            value={newLoft.name}
                            onChange={handleChange}
                            autoFocus
                            slotProps={{
                                input: {
                                    inputProps: {
                                        maxLength: LIMITS.LOFT_NAME_LENGTH,
                                    },
                                },
                            }}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={newLoft.description}
                            onChange={handleChange}
                            slotProps={{
                                input: {
                                    inputProps: {
                                        maxLength:
                                            LIMITS.LOFT_DESCRIPTION_LENGTH,
                                    },
                                },
                            }}
                        />
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!newLoft.name.trim()}
                >
                    Create
                </Button>
                <Button onClick={handleClosing}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateLoftDialog;
