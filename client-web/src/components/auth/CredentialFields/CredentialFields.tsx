import { TextField } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../hooks/auth";
import { handleFormChange } from "../../../utils/formUtils";
import PasswordAdornment from "../PasswordAdornment/PasswordAdornment";

const CredentialFields = ({ error }: { error: string }) => {
    const { authData, setAuthData } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <TextField
                className="auth__input"
                label="Email"
                name="email"
                type="email"
                value={authData.email}
                onChange={(e) => handleFormChange(e, setAuthData)}
                error={error ? true : false}
                helperText={error ? error : " "}
            />

            <TextField
                className="auth__input"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={authData.password}
                onChange={(e) => handleFormChange(e, setAuthData)}
                InputProps={{
                    //TODO
                    endAdornment: (
                        <PasswordAdornment
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                    ),
                }}
            ></TextField>
        </>
    );
};

export default CredentialFields;
