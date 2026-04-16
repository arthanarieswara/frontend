import { FaBars } from "react-icons/fa";
import "./Navbar.css";

function Navbar({ toggleSidebar }) {

    return (

        <div className="navbar">

            {/* <FaBars className="toggle-btn" onClick={toggleSidebar} /> */}

            <h3>Study World College of Engineering</h3>

        </div>

    )

}

export default Navbar;