import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import React from "react";

const PasswordAdornment = ({
    showPassword,
    setShowPassword,
}: {
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <InputAdornment position="end">
            <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
            >
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    );
};

export default PasswordAdornment;
