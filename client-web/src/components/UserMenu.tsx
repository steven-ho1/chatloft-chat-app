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
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/user";
import logo from "/logo.png";

const UserMenu = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
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
                    onClick={handleClick}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "black",
                        bgcolor: "grey.100",
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
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                >
                    <MenuItem>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Profile"></ListItemText>
                    </MenuItem>
                    <MenuItem>
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
            </Grid2>
        </Grid2>
    );
};

export default UserMenu;
