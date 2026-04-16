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
  const [period, setPeriod] = useState(""); // ✅ NEW

  const [attendanceSummary, setAttendanceSummary] = useState(null);

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
    if (!subject || !date) {
      alert("Select subject and date");
      return;
    }

    try {
      let url = `/attendance/summary?subject_id=${subject}&date=${date}`;

      // ✅ ADD PERIOD FILTER
      if (period) {
        url += `&period=${period}`;
      }

      const res = await api.get(url);

      setAttendanceSummary(res.data);

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

        {/* ================= ATTENDANCE FILTER ================= */}

        <div className="attendance-filter-section">

          <h3>Attendance Summary</h3>

          <div className="filters">

            {/* SUBJECT */}
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Select Subject</option>
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

            {/* ✅ PERIOD */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="">All Periods</option>
              {[1,2,3,4,5,6,7,8].map((p) => (
                <option key={p} value={p}>
                  Period {p}
                </option>
              ))}
            </select>

            <button onClick={getAttendanceSummary}>
              Get Summary
            </button>

          </div>

        </div>

        {/* ================= SUMMARY RESULT ================= */}

        {attendanceSummary && (
          <div className="cards">

            <div className="card">
              <h3>Present</h3>
              <p>{attendanceSummary.present_count}</p>
            </div>

            <div className="card">
              <h3>Absent</h3>
              <p>{attendanceSummary.absent_count}</p>
            </div>

            <div className="card">
              <h3>Total</h3>
              <p>{attendanceSummary.total_students}</p>
            </div>

          </div>
        )}

      </div>
    </Layout>
  );
}

export default Dashboard;