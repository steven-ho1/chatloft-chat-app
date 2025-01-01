import "./AuthTitle.css";
import logo from "/logo.png";

const AuthTitle = ({ heading }: { heading: string }) => {
    return (
        <div className="auth-title flex-column">
            <img className="auth-title__logo" src={logo} alt="logo" />
            <h2 className="auth-title__heading">{heading}</h2>
        </div>
    );
};

export default AuthTitle;
