import { TextField } from "@mui/material";
import { useState } from "react";
import { useAuthForm } from "../../../hooks/authForm";
import { LIMITS } from "../../../types/limits";
import { handleFormChange } from "../../../utils/formUtils";
import PasswordAdornment from "../passwordAdornment/PasswordAdornment";

const CredentialFields = ({ error }: { error: string }) => {
    const { authData, setAuthData } = useAuthForm();
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
                slotProps={{
                    input: {
                        inputProps: {
                            maxLength: LIMITS.EMAIL_LENGTH,
                        },
                    },
                }}
            />

            <TextField
                className="auth__input"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={authData.password}
                onChange={(e) => handleFormChange(e, setAuthData)}
                slotProps={{
                    input: {
                        endAdornment: (
                            <PasswordAdornment
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />
                        ),
                        inputProps: {
                            maxLength: LIMITS.PASSWORD_LENGTH,
                        },
                    },
                }}
            ></TextField>
        </>
    );
};

export default CredentialFields;
