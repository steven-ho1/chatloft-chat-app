import { Close } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid2,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { User } from "../../../common/user";
import { useUser } from "../hooks/user";
import { HttpMethod } from "../types/httpMethods";
import { EndPoint, getEndPoint } from "../utils/apiConfig";

const ProfileDialog = ({
    handleDialogClose,
}: {
    handleDialogClose: () => void;
}) => {
    const { user, setUser } = useUser();
    const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);

    const [name, setName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const cancelNameChange = () => {
        setIsEditingName(false);
        setName("");
    };

    const handleNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const endpoint = getEndPoint(EndPoint.Name);
        const options: RequestInit = {
            method: HttpMethod.PATCH,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ fullName: name.trim() }),
        };

        (async () => {
            try {
                const response = await fetch(endpoint, options);
                if (!response.ok) {
                    // TODO handle error
                    return;
                }
                const user: User = await response.json();
                setUser(user);
                setIsEditingName(false);
                setName("");
            } catch (error) {
                console.error(error);
            }
        })();
    };

    return (
        <Dialog open={true} fullWidth maxWidth={"sm"}>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                Profile{" "}
                <IconButton onClick={handleDialogClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Grid2 container>
                    <Grid2
                        size="grow"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 3,
                        }}
                    >
                        <Avatar sx={{ width: 90, height: 90 }} />
                        {isEditingProfilePic ? (
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button variant="contained">Save</Button>
                                <Button>Cancel</Button>
                            </Box>
                        ) : (
                            <Button
                                onClick={() => setIsEditingProfilePic(true)}
                            >
                                Edit
                            </Button>
                        )}
                    </Grid2>
                    <Divider orientation="vertical" flexItem />
                    <Grid2 size={7}>
                        <Box
                            component={"form"}
                            onSubmit={handleNameSubmit}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {isEditingName ? (
                                    <TextField
                                        label="Full name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <Typography>Full name</Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            {user?.fullName}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            {isEditingName ? (
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Button variant="contained" type="submit">
                                        Save
                                    </Button>
                                    <Button
                                        onClick={cancelNameChange}
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            ) : (
                                <Button onClick={() => setIsEditingName(true)}>
                                    Edit
                                </Button>
                            )}
                        </Box>
                    </Grid2>
                </Grid2>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileDialog;
