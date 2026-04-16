import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Departments from "../pages/departments/Departments";
import Students from "../pages/students/Students";
import Faculty from "../pages/faculty/Faculty";
import Subjects from "../pages/Subjects/Subjects";
import Attendance from "../pages/Attendance/Attendance";
import Users from "../pages/users/Users";
import UserMapping from "../pages/UserMapping/UserMapping"; // ✅ NEW
import FacultyAttendance from "../pages/faculty/FacultyAttendance";
import Marks from "../pages/marks/Marks";
import ResultSheet from "../pages/marks/ResultSheet";
import SubjectMarks from "../pages/marks/SubjectMarks";
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
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/users" element={<Users />} />
        <Route path="/faculty-attendance" element={<FacultyAttendance />} />

        {/* ✅ NEW ROUTE */}
        <Route path="/mapping" element={<UserMapping />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/result-sheet" element={<ResultSheet />} />
        <Route path="/subject-marks" element={<SubjectMarks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
