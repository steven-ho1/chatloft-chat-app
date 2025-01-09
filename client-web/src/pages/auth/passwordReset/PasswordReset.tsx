import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const PasswordReset = () => {
    return (
        <Link to="login">
            <Button variant="contained">Go back</Button>
        </Link>
    );
};

export default PasswordReset;
