import { Close, Delete } from "@mui/icons-material";
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
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User } from "../../../common/user";
import { useUser } from "../hooks/user";
import { HttpMethod } from "../types/httpMethods";
import { LIMITS } from "../types/limits";
import {
    DEFAULT_USER_PROFILE_PIC_URL,
    PROFILE_PICS_BUCKET,
} from "../types/profile-pics";
import { EndPoint, getEndPoint } from "../utils/apiConfig";

const ProfileDialog = ({
    handleDialogClose,
}: {
    handleDialogClose: () => void;
}) => {
    const { user, setUser, supabase } = useUser();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const uploadRef = useRef<HTMLInputElement | null>(null);

    const [profilePreview, setProfilePreview] = useState<string>(
        user?.profilePicUrl as string
    );
    const [profilePicFile, setProfilePicFile] = useState<File | string | null>(
        null
    );
    const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);
    const cancelProfilePicChange = () => {
        setIsEditingProfilePic(false);
        setProfilePreview(user?.profilePicUrl as string);
        setProfilePicFile(null);
        if (uploadRef.current) uploadRef.current.value = "";
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const profilePicFile = event.target.files?.[0];
        if (profilePicFile) {
            setIsEditingProfilePic(true);
            setProfilePreview(URL.createObjectURL(profilePicFile));
            setProfilePicFile(profilePicFile);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            let profilePicUrl: string;
            if (profilePicFile === DEFAULT_USER_PROFILE_PIC_URL) {
                profilePicUrl = profilePicFile;
            } else {
                const { data, error } = await supabase!.storage
                    .from(PROFILE_PICS_BUCKET)
                    .upload(
                        `users/${user?.id}/${(profilePicFile as File).name}`,
                        profilePicFile!,
                        {
                            cacheControl: "3600",
                            upsert: true,
                        }
                    );

                if (error) {
                    // TODO later handle error
                    alert(error.message);
                    return;
                }

                const {
                    data: { publicUrl },
                } = supabase!.storage
                    .from(PROFILE_PICS_BUCKET)
                    .getPublicUrl(data!.path);
                profilePicUrl = publicUrl;
            }

            const token = localStorage.getItem("token");
            const endpoint = getEndPoint(EndPoint.ProfilePic);
            const options: RequestInit = {
                method: HttpMethod.PATCH,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ profilePicUrl }),
            };

            const response = await fetch(endpoint, options);
            if (!response.ok) {
                // TODO later handle error
                return;
            }
            const newUser: User = await response.json();
            console.log(newUser);
            setIsEditingProfilePic(false);
            setUser(newUser);
            setProfilePreview(newUser.profilePicUrl);
            setProfilePicFile(null);
            if (uploadRef.current) uploadRef.current.value = "";
        } catch (error) {
            console.error(error);
        }
    };

    const deleteProfilePic = () => {
        setIsEditingProfilePic(true);
        setProfilePreview(DEFAULT_USER_PROFILE_PIC_URL);
        setProfilePicFile(DEFAULT_USER_PROFILE_PIC_URL);
    };

    const [name, setName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const cancelNameChange = () => {
        setIsEditingName(false);
        setName("");
    };

    const handleNameSubmit = async (e: React.FormEvent) => {
        try {
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
    };

    useEffect(() => {
        // Clean up the object URL when the component unmounts
        return () => {
            URL.revokeObjectURL(profilePreview);
        };
    }, [profilePreview]);

    return (
        <Dialog open={true} fullWidth maxWidth={"sm"} fullScreen={fullScreen}>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                Profile
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
                        }}
                    >
                        <Avatar
                            sx={{ width: 90, height: 90 }}
                            src={profilePreview}
                        />
                        <Box
                            component="form"
                            mt={2}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                            }}
                            onSubmit={handleProfileSubmit}
                        >
                            {isEditingProfilePic ? (
                                <>
                                    <Button variant="contained" type="submit">
                                        Save
                                    </Button>
                                    <Button onClick={cancelProfilePicChange}>
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button component="label">
                                        Edit
                                        <input
                                            ref={uploadRef}
                                            type="file"
                                            onChange={handleFileUpload}
                                            accept="image/*"
                                            hidden
                                        />
                                    </Button>
                                    <IconButton
                                        color="error"
                                        disabled={
                                            user?.profilePicUrl ===
                                            DEFAULT_USER_PROFILE_PIC_URL
                                        }
                                        onClick={deleteProfilePic}
                                    >
                                        <Delete />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    </Grid2>
                    <Divider orientation="vertical" flexItem />
                    <Grid2 size={6}>
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
                                        slotProps={{
                                            input: {
                                                inputProps: {
                                                    maxLength:
                                                        LIMITS.FULL_NAME_LENGTH,
                                                },
                                            },
                                        }}
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
