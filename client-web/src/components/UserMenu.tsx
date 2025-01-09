import { ArrowDropDown, Logout, Person, Settings } from "@mui/icons-material";
import {
    Avatar,
    Button,
    Grid2,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/user";
import ProfileDialog from "./ProfileDialog";
import logo from "/logo.png";

const UserMenu = () => {
    const navigate = useNavigate();
    const { clearUserSession, user } = useUser();

    const logout = () => {
        clearUserSession();
        navigate("/login");
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const [activeDialog, setActiveDialog] = useState<string | null>(null);
    const handleDialogOpen = (dialogType: string) => {
        setActiveDialog(dialogType);
        handleMenuClose();
    };

    const handleDialogClose = () => {
        setActiveDialog(null);
    };

    return (
        <Grid2 container padding={1}>
            <Grid2
                display="flex"
                justifyContent="center"
                alignItems="center"
                size="grow"
            >
                <img src={logo} alt="ChatLoft" style={{ width: "40px" }} />
            </Grid2>
            <Grid2 size={9}>
                <Button
                    fullWidth
                    onClick={handleMenuOpen}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "black",
                        bgcolor: "grey.100",
                        textTransform: "none",
                    }}
                    endIcon={
                        <ArrowDropDown
                            sx={{
                                transform: open
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                            }}
                        />
                    }
                >
                    <Avatar
                        alt="Profile pic"
                        src={user?.profilePicUrl as string}
                        sx={{ mr: 1 }}
                    />
                    <Typography>{user?.fullName}</Typography>
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                >
                    <MenuItem onClick={() => handleDialogOpen("profile")}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Profile"></ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => alert("Not implemented yet")}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Account settings"></ListItemText>
                    </MenuItem>
                    <MenuItem onClick={logout}>
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary="Log out"></ListItemText>
                    </MenuItem>
                </Menu>

                {activeDialog === "profile" && (
                    <ProfileDialog handleDialogClose={handleDialogClose} />
                )}
            </Grid2>
        </Grid2>
    );
};

export default UserMenu;
