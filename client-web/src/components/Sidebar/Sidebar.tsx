import {
    faAddressBook,
    faBell,
    faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const logout = () => {
        navigate("/login");
    };

    return (
        <nav className="sidebar flex-column">
            <Link to="/chats">
                <img className="logo" src={logo} alt="iChat" />
            </Link>

            <ul className="menu flex-column">
                <li>...</li>
                <li>
                    <Link to="/chats">
                        {/*to do later: should be able to remember last chat opened*/}
                        <FontAwesomeIcon icon={faComment} />
                    </Link>
                </li>
                <li>
                    <Link to="/contacts">
                        <FontAwesomeIcon icon={faAddressBook} />
                    </Link>
                </li>
                <li>
                    <FontAwesomeIcon icon={faBell} />
                </li>
            </ul>

            <button onClick={logout}>Logout</button>
        </nav>
    );
};

export default Sidebar;
