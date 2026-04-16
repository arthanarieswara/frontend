import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState({
    students: 0,
    faculty: 0,
    departments: 0,
  });

  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");

  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [summaryType, setSummaryType] = useState("");

  /* ✅ NEW FACULTY STATE */
  const [facultySummary, setFacultySummary] = useState([]);
  const [facultyTotal, setFacultyTotal] = useState(0);

  /* ================= INIT ================= */

  useEffect(() => {
    fetchDashboard();
    fetchSubjects();
  }, []);

  const fetchDashboard = async () => {
    const res = await api.get("/dashboard/admin");
    setData(res.data);
  };

  const fetchSubjects = async () => {
    const res = await api.get("/subjects");
    setSubjects(res.data || []);
  };

  /* ================= STUDENT SUMMARY ================= */

  const getAttendanceSummary = async () => {
    if (!date) return alert("Select date");

    let url = `/attendance/summary?date=${date}`;

    if (subject) url += `&subject_id=${subject}`;
    if (period) url += `&period=${period}`;
    if (semester) url += `&semester=${semester}`;
    if (section) url += `&section=${section}`;

    const res = await api.get(url);

    setAttendanceSummary(res.data);
    setSummaryType(res.data.type);
  };

  /* ================= FACULTY SUMMARY ================= */

  const getFacultySummary = async () => {
    if (!date) return alert("Select date");

    const res = await api.get(
      `/faculty-attendance/summary?date=${date}`
    );

    setFacultySummary(res.data.statusSummary);
    setFacultyTotal(res.data.total);
  };

  return (
    <Layout>
      <div className="dashboard">

        <h2>Admin Dashboard</h2>

        {/* ================= MAIN CARDS ================= */}
        <div className="cards">
          <div className="card">
            <h3>Total Students</h3>
            <p>{data.students}</p>
          </div>

          <div className="card">
            <h3>Total Faculty</h3>
            <p>{data.faculty}</p>
          </div>

          <div className="card">
            <h3>Total Departments</h3>
            <p>{data.departments}</p>
          </div>
        </div>

        {/* ================= FILTER ================= */}
        <div className="attendance-filter-section">

          <h3>Attendance Reports</h3>

          <div className="filters">

            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => (
                <option key={s} value={s}>Sem {s}</option>
              ))}
            </select>

            <select value={section} onChange={(e) => setSection(e.target.value)}>
              <option value="">All Sections</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>

            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="">All Periods</option>
              {[1,2,3,4,5,6,7,8].map(p => (
                <option key={p} value={p}>P{p}</option>
              ))}
            </select>

            <button onClick={getAttendanceSummary}>
              Student Report
            </button>

            <button onClick={getFacultySummary}>
              Faculty Report
            </button>

          </div>
        </div>

        {/* ================= STUDENT RESULT ================= */}

        {attendanceSummary && summaryType === "single" && (
          <div className="cards">
            <div className="card">
              <h3>Present</h3>
              <p>{attendanceSummary.data.present_count}</p>
            </div>
            <div className="card">
              <h3>Absent</h3>
              <p>{attendanceSummary.data.absent_count}</p>
            </div>
            <div className="card">
              <h3>Total</h3>
              <p>{attendanceSummary.data.total_students}</p>
            </div>
          </div>
        )}

        {/* ================= FACULTY RESULT ================= */}

        {facultySummary.length > 0 && (
          <div className="report-section">

            <h3>Faculty Attendance Report</h3>

            <div className="cards">
              {facultySummary.map((f, index) => (
                <div className="card" key={index}>
                  <h4>{f.status}</h4>
                  <p>{f.count}</p>
                </div>
              ))}

              <div className="card total">
                <h4>Total</h4>
                <p>{facultyTotal}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </Layout>
  );
}

export default Dashboard;