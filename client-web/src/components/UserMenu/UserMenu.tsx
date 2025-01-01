import { ArrowDropDown, Logout, Person, Settings } from "@mui/icons-material";
import {
    Avatar,
    Box,
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
import logo from "../../assets/logo.png";
import { useUser } from "../../hooks/user";
import "./UserMenu.css";

const UserMenu = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const logout = () => {
        localStorage.removeItem("token");
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
                <img src={logo} alt="ChatLoft" className="logo" />
            </Grid2>
            <Grid2 size={9}>
                <Button
                    id="user-menu-button"
                    fullWidth
                    onClick={handleClick}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "black",
                        bgcolor: "grey.100",
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <Avatar
                            alt="Profile pic"
                            src={user?.profilePicUrl as string}
                            sx={{ mr: 1 }}
                        />
                        <Typography>{user?.fullName}</Typography>
                    </Box>
                    <ArrowDropDown
                        sx={{
                            transform: open ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                        }}
                    />
                </Button>
            </Grid2>
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
    );
};

export default UserMenu;
