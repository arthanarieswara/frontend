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

  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [summaryType, setSummaryType] = useState("");

  /* ================= INIT ================= */

  useEffect(() => {
    fetchDashboard();
    fetchSubjects();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard/admin");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FETCH SUMMARY ================= */

  const getAttendanceSummary = async () => {
    if (!date) {
      alert("Select date");
      return;
    }

    try {
      let url = `/attendance/summary?date=${date}`;

      if (subject) url += `&subject_id=${subject}`;
      if (period) url += `&period=${period}`;
      if (semester) url += `&semester=${semester}`;

      const res = await api.get(url);

      setAttendanceSummary(res.data);
      setSummaryType(res.data.type);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance summary");
    }
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

        {/* ================= FILTER SECTION ================= */}
        <div className="attendance-filter-section">
          <h3>Attendance Summary</h3>

          <div className="filters">
            {/* SUBJECT */}
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* DATE */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {/* SEMESTER */}
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>

            {/* PERIOD */}
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="">All Periods</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                <option key={p} value={p}>
                  Period {p}
                </option>
              ))}
            </select>

            <button onClick={getAttendanceSummary}>Get Summary</button>
          </div>
        </div>

        {/* ================= SINGLE PERIOD ================= */}
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

        {/* ================= ALL PERIODS ================= */}
        {attendanceSummary && summaryType === "all" && (
          <>
            <table className="attendance-table">
              <thead>
                <tr>
                  {!subject && <th>Subject</th>} {/* ✅ NEW */}
                  <th>Period</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {attendanceSummary.periods.map((p, index) => (
                  <tr key={index}>
                    {!subject && <td>{p.subject_name}</td>} {/* ✅ NEW */}
                    <td>Period {p.period}</td>
                    <td>{p.present_count}</td>
                    <td>{p.absent_count}</td>
                    <td>{p.total_students}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTAL SUMMARY */}
            <div className="cards">
              <div className="card">
                <h3>Total Present</h3>
                <p>{attendanceSummary.total.present_count}</p>
              </div>

              <div className="card">
                <h3>Total Absent</h3>
                <p>{attendanceSummary.total.absent_count}</p>
              </div>

              <div className="card">
                <h3>Total Students</h3>
                <p>{attendanceSummary.total.total_students}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
