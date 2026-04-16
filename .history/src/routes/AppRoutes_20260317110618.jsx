import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Departments from "../pages/departments/Departments";
import Students from "../pages/students/Students";
import Faculty from "../pages/faculty/Faculty";
import Subjects from "../pages/Subjects/Subjects";
import Attendance from "../pages/Attendance/Attendance";
import Users from "../pages/users/Users"; 

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/students" element={<Students />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/subjects" element={<Subjects />} />

        {/* Attendance Route */}
        <Route path="/attendance" element={<Attendance />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
