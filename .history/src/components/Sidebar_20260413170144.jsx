import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUniversity,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardCheck,
  FaSignOutAlt,
  FaUserCircle,
  FaUsers,
  FaProjectDiagram,

} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar({ collapsed }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="main-content">
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img src="/college-logo.png" className="sidebar-logo" />
        </div>

        <nav className="menu">
          {/* COMMON (ADMIN + FACULTY) */}
          <NavLink to="/dashboard" className="menu-item">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/students" className="menu-item">
            <FaUserGraduate />
            <span>Students</span>
          </NavLink>

          <NavLink to="/subjects" className="menu-item">
            <FaBook />
            <span>Subjects</span>
          </NavLink>

          <NavLink to="/attendance" className="menu-item">
            <FaClipboardCheck />
            <span>Attendance</span>
          </NavLink>

          {/* ADMIN ONLY */}
          {role === "Admin" && (
            <>
              <NavLink to="/departments" className="menu-item">
                <FaUniversity />
                <span>Departments</span>
              </NavLink>

              <NavLink to="/faculty" className="menu-item">
                <FaChalkboardTeacher />
                <span>Faculty</span>
              </NavLink>

              <NavLink to="/users" className="menu-item">
                <FaUsers />
                <span>Users</span>
              </NavLink>

              <NavLink to="/mapping" className="menu-item">
                <FaProjectDiagram />
                <span>Mapping</span>
              </NavLink>
              
              <NavLink to="/faculty-attendance" className="menu-item">
                <FaClipboardCheck />
                <span>Faculty Attendance</span>
              </NavLink>

              <NavLink to="/marks" className="menu-item">
                <FaClipboardCheck />
                <span>Marks</span>
              </NavLink>
              
              <NavLink to="/result-sheet" className="menu-item">
                <FaClipboardCheck />
                <span>Result Sheet</span>
              </NavLink>

              {/* <NavLink to="/subject-marks" className="menu-item">
                <FaClipboardCheck />
                <span>Subject Mark</span>
              </NavLink> */}


            </>
          )}
        </nav>

        {/* PROFILE + LOGOUT */}

        <div className="bottom-section">
          <div className="profile">
            <FaUserCircle className="profile-icon" />
            <span>{role}</span>
          </div>

          <div className="logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
