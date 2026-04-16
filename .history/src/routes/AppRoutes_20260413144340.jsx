import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Departments from "../pages/departments/Departments";
import Students from "../pages/students/Students";
import Faculty from "../pages/faculty/Faculty";
import Subjects from "../pages/Subjects/Subjects";
import Attendance from "../pages/Attendance/Attendance";
import Users from "../pages/users/Users";
import UserMapping from "../pages/UserMapping/UserMapping";
import FacultyAttendance from "../pages/faculty/FacultyAttendance";

import Marks from "../pages/marks/Marks";
import SubjectMarks from "../pages/marks/SubjectMarks";
import ResultSheet from "../pages/marks/ResultSheet";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTH ================= */}
        <Route path="/" element={<Login />} />

        {/* ================= MAIN ================= */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/students" element={<Students />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/users" element={<Users />} />
        <Route path="/mapping" element={<UserMapping />} />
        <Route path="/faculty-attendance" element={<FacultyAttendance />} />

        {/* ================= MARKS ================= */}
        <Route path="/marks-entry" element={<Marks />} />
        <Route path="/subject-marks" element={<SubjectMarks />} />

        {/* ================= REPORT ================= */}
        <Route path="/reports" element={<ResultSheet />} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<h2 style={{padding:20}}>❌ Page Not Found</h2>} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;