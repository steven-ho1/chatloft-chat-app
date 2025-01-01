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
import { Loft } from "../../../common/loft";

export default function CreateLoftDialog({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (newLoft: Loft) => void;
}) {
    const initialState: Loft = {
        name: "",
        description: "",
        profilePicUrl: null,
    };
    const [newLoft, setNewLoft] = useState<Loft>(initialState);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewLoft((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(newLoft);
        onClose();
    };

    const handleClosing = () => {
        setNewLoft(initialState);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClosing}
            fullWidth
            maxWidth="sm"
            fullScreen={fullScreen}
        >
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
                            <Button>Upload</Button>
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
                        />
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} variant="contained">
                    Create
                </Button>
                <Button onClick={handleClosing}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
