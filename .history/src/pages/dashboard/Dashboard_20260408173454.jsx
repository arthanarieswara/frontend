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

  /* ================= STUDENT ================= */
  const [sDate, setSDate] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [period, setPeriod] = useState("");
  const [studentSummary, setStudentSummary] = useState(null);

  /* ================= FACULTY ================= */
  const [fDate, setFDate] = useState("");
  const [facultySummary, setFacultySummary] = useState([]);
  const [facultyTotal, setFacultyTotal] = useState(0);

  /* ================= MARKS ================= */
  const [marksSummary, setMarksSummary] = useState(null);
  const [mSemester, setMSemester] = useState("");
  const [mSection, setMSection] = useState("");
  const [mSubject, setMSubject] = useState("");

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

  /* ================= STUDENT REPORT ================= */

  const getStudentReport = async () => {
    if (!sDate) return alert("Select date");

    let url = `/attendance/summary?date=${sDate}`;

    if (subject) url += `&subject_id=${subject}`;
    if (period) url += `&period=${period}`;
    if (semester) url += `&semester=${semester}`;
    if (section) url += `&section=${section}`;

    const res = await api.get(url);
    setStudentSummary(res.data);
  };

  /* ================= FACULTY REPORT ================= */

  const getFacultyReport = async () => {
    if (!fDate) return alert("Select date");

    const res = await api.get(`/faculty-attendance/summary?date=${fDate}`);

    setFacultySummary(res.data.statusSummary);
    setFacultyTotal(res.data.total);
  };

  /* ================= MARKS REPORT ================= */

  const getMarksReport = async () => {
    if (!mSemester || !mSubject) {
      return alert("Select semester & subject");
    }

    let url = `/marks/report?semester=${mSemester}&subject_id=${mSubject}`;

    if (mSection) url += `&section=${mSection}`;

    const res = await api.get(url);
    setMarksSummary(res.data);
  };

  return (
    <Layout>
      <div className="dashboard">
        <h2 className="dashboard-title">Admin Dashboard</h2>

        {/* ================= STATS ================= */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Students</h4>
            <p>{data.students}</p>
          </div>

          <div className="stat-card">
            <h4>Faculty</h4>
            <p>{data.faculty}</p>
          </div>

          <div className="stat-card">
            <h4>Departments</h4>
            <p>{data.departments}</p>
          </div>
        </div>

        {/* ================= STUDENT SECTION ================= */}
        <div className="section-card">
          <h3>Student Attendance</h3>

          <div className="filters">
            <input
              type="date"
              value={sDate}
              onChange={(e) => setSDate(e.target.value)}
            />

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Sem {s}
                </option>
              ))}
            </select>

            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="">Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>

            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="">Period</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                <option key={p} value={p}>
                  P{p}
                </option>
              ))}
            </select>

            <button onClick={getStudentReport}>Generate</button>
          </div>

          {studentSummary && (
            <div className="report-grid">
              <div className="report-card present">
                <h4>Present</h4>
                <p>{studentSummary?.data?.present_count}</p>
              </div>

              <div className="report-card absent">
                <h4>Absent</h4>
                <p>{studentSummary?.data?.absent_count}</p>
              </div>

              <div className="report-card total">
                <h4>Total</h4>
                <p>{studentSummary?.data?.total_students}</p>
              </div>
            </div>
          )}
        </div>

        {/* ================= FACULTY SECTION ================= */}
        <div className="section-card">
          <h3>Faculty Attendance</h3>

          <div className="filters">
            <input
              type="date"
              value={fDate}
              onChange={(e) => setFDate(e.target.value)}
            />

            <button onClick={getFacultyReport}>Generate</button>
          </div>

          {facultySummary.length > 0 && (
            <div className="report-grid">
              {facultySummary.map((f, i) => (
                <div className="report-card" key={i}>
                  <h4>{f.status}</h4>
                  <p>{f.count}</p>
                </div>
              ))}

              <div className="report-card total">
                <h4>Total</h4>
                <p>{facultyTotal}</p>
              </div>
            </div>
          )}
        </div>

        {/* ================= MARKS SECTION ================= */}

        {/* ================= MARKS SECTION ================= */}

        <div className="section-card marks-section">
          <div className="section-header">
            <h3>📊 Marks Analytics</h3>
            <button onClick={getMarksReport} className="primary-btn">
              Generate Report
            </button>
          </div>

          <div className="filters modern-filters">
            <select
              value={mSubject}
              onChange={(e) => setMSubject(e.target.value)}
            >
              <option value="">Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={mSemester}
              onChange={(e) => setMSemester(e.target.value)}
            >
              <option value="">Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Sem {s}
                </option>
              ))}
            </select>

            <select
              value={mSection}
              onChange={(e) => setMSection(e.target.value)}
            >
              <option value="">Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>

          {marksSummary && (
            <div className="marks-grid">
              <div className="card stat">
                <h4>Average</h4>
                <p>{marksSummary.average}</p>
              </div>

              <div className="card stat">
                <h4>Highest</h4>
                <p>{marksSummary.highest}</p>
              </div>

              <div className="card stat">
                <h4>Lowest</h4>
                <p>{marksSummary.lowest}</p>
              </div>

              <div className="card total">
                <h4>Total Students</h4>
                <p>{marksSummary.total}</p>
              </div>

              <div className="card pass">
                <h4>Pass</h4>
                <p>{marksSummary.pass_count}</p>
              </div>

              <div className="card fail">
                <h4>Fail</h4>
                <p>{marksSummary.fail_count}</p>
              </div>
              <div className="card absent">
                <h4>Absent</h4>
                <p>{marksSummary.absent_count}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
