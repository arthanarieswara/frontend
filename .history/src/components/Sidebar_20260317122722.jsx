import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUniversity,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardCheck,
  FaMoneyBill,
  FaSignOutAlt,
  FaUserCircle,
  
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar({ collapsed }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <img src="/college-logo.png" className="sidebar-logo" />
      </div>

      <nav className="menu">
        <NavLink to="/dashboard" className="menu-item">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/departments" className="menu-item">
          <FaUniversity />
          <span>Departments</span>
        </NavLink>

        <NavLink to="/students" className="menu-item">
          <FaUserGraduate />
          <span>Students</span>
        </NavLink>

        <NavLink to="/faculty" className="menu-item">
          <FaChalkboardTeacher />
          <span>Faculty</span>
        </NavLink>

        <NavLink to="/subjects" className="menu-item">
          <FaBook />
          <span>Subjects</span>
        </NavLink>

        <NavLink to="/attendance" className="menu-item">
          <FaClipboardCheck />
          <span>Attendance</span>
        </NavLink>

        <NavLink to="/fees" className="menu-item">
          <FaMoneyBill />
          <span>Fees</span>
        </NavLink>

        <NavLink to="/users" className="menu-item">
          <FaUser />
          <span>Users</span>
        </NavLink>
      </nav>

      {/* PROFILE SECTION */}

      <div className="profile">
        <FaUserCircle className="profile-icon" />
        <span>Admin</span>
      </div>

      {/* LOGOUT */}

      <div className="logout" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </div>
  );
}

export default Sidebar;
