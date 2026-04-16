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

  /* GLOBAL */
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  /* MARKS FILTER */
  const [mDepartment, setMDepartment] = useState("");
  const [mSemester, setMSemester] = useState("");
  const [mSubject, setMSubject] = useState("");
  const [mSection, setMSection] = useState("");

  const [formattedMarks, setFormattedMarks] = useState(null);

  /* ================= INIT ================= */
  useEffect(() => {
    fetchDashboard();
    fetchDepartments();
  }, []);

  const fetchDashboard = async () => {
    const res = await api.get("/dashboard/admin");
    setData(res.data);
  };

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  /* ================= SUBJECT FILTER ================= */
  useEffect(() => {
    if (mDepartment && mSemester) {
      fetchSubjects();
    } else {
      setSubjects([]);
      setMSubject("");
    }
  }, [mDepartment, mSemester]);

  const fetchSubjects = async () => {
    const res = await api.get(
      `/subjects/by-semester?semester=${mSemester}&department_id=${mDepartment}`
    );
    setSubjects(res.data);
  };

  /* ================= MARKS REPORT ================= */
  const getMarksReport = async () => {
    if (!mDepartment || !mSemester || !mSubject) {
      return alert("Select Department, Semester & Subject");
    }

    let url = `/marks/report?semester=${mSemester}&subject_id=${mSubject}&department_id=${mDepartment}`;

    if (mSection) url += `&section=${mSection}`;

    const res = await api.get(url);

    const d = res.data;

    setFormattedMarks({
      average: Number(d.average || 0),
      highest: Number(d.highest || 0),
      lowest: Number(d.lowest || 0),
      total: Number(d.total || 0),
      pass: Number(d.pass_count || 0),
      fail: Number(d.fail_count || 0),
      absent: Number(d.absent_count || 0),
    });
  };

  return (
    <Layout>
      <div className="dashboard">

        <h2 className="dashboard-title">📊 Admin Dashboard</h2>

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

        {/* ================= MARKS ANALYTICS ================= */}
        <div className="section-card">

          <div className="section-header">
            <h3>📘 Marks Analytics</h3>
            <button className="primary-btn" onClick={getMarksReport}>
              Generate
            </button>
          </div>

          <div className="filters modern-filters">

            {/* Department */}
            <select
              value={mDepartment}
              onChange={(e) => setMDepartment(Number(e.target.value))}
            >
              <option value="">Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Semester */}
            <select
              value={mSemester}
              onChange={(e) => setMSemester(Number(e.target.value))}
            >
              <option value="">Semester</option>
              {[1,2,3,4,5,6,7,8].map((s) => (
                <option key={s} value={s}>Sem {s}</option>
              ))}
            </select>

            {/* Subject */}
            <select
              value={mSubject}
              onChange={(e) => setMSubject(e.target.value)}
              disabled={!mDepartment || !mSemester}
            >
              <option value="">Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>

            {/* Section */}
            <select
              value={mSection}
              onChange={(e) => setMSection(e.target.value)}
            >
              <option value="">Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>

          </div>

          {/* RESULT */}
          {formattedMarks && (
            <div className="marks-grid">

              <div className="card stat">
                <h4>Average</h4>
                <p>{formattedMarks.average}</p>
              </div>

              <div className="card stat">
                <h4>Highest</h4>
                <p>{formattedMarks.highest}</p>
              </div>

              <div className="card stat">
                <h4>Lowest</h4>
                <p>{formattedMarks.lowest}</p>
              </div>

              <div className="card total">
                <h4>Total</h4>
                <p>{formattedMarks.total}</p>
              </div>

              <div className="card pass">
                <h4>Pass</h4>
                <p>{formattedMarks.pass}</p>
              </div>

              <div className="card fail">
                <h4>Fail</h4>
                <p>{formattedMarks.fail}</p>
              </div>

              <div className="card absent">
                <h4>Absent</h4>
                <p>{formattedMarks.absent}</p>
              </div>

            </div>
          )}

        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;