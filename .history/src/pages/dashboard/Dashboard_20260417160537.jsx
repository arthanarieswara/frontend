import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Dashboard.css";

function Dashboard() {

  /* ================= GLOBAL ================= */
  const [data, setData] = useState({ students: 0, faculty: 0, departments: 0 });
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);

  /* ================= ATTENDANCE ================= */
  const [sDate, setSDate] = useState("");
  const [sDepartment, setSDepartment] = useState("");
  const [sSemester, setSSemester] = useState("");
  const [sSection, setSSection] = useState("");
  const [studentSummary, setStudentSummary] = useState(null);

  /* ================= FACULTY ================= */
  const [fDate, setFDate] = useState("");
  const [facultySummary, setFacultySummary] = useState([]);
  const [facultyTotal, setFacultyTotal] = useState(0);

  /* ================= MARKS ================= */
  const [mDepartment, setMDepartment] = useState("");
  const [mSemester, setMSemester] = useState("");
  const [mSubject, setMSubject] = useState("");
  const [mSection, setMSection] = useState("");
  const [mDate, setMDate] = useState("");
  const [marksSummary, setMarksSummary] = useState(null);

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
      fetchSubjects(mSemester, mDepartment);
    } else {
      setSubjects([]);
      setMSubject("");
    }
  }, [mDepartment, mSemester]);

  const fetchSubjects = async (sem, dept) => {
    const res = await api.get(
      `/subjects/by-semester?semester=${sem}&department_id=${dept}`
    );
    setSubjects(res.data);
  };

  /* ================= ATTENDANCE ================= */
  const getStudentReport = async () => {
    if (!sDate) return alert("Select date");

    let url = `/attendance/summary?date=${sDate}`;
    if (sDepartment) url += `&department_id=${sDepartment}`;
    if (sSemester) url += `&semester=${sSemester}`;
    if (sSection) url += `&section=${sSection}`;

    const res = await api.get(url);
    setStudentSummary(res.data);
  };

  /* ================= FACULTY ================= */
  const getFacultyReport = async () => {
    if (!fDate) return alert("Select date");

    const res = await api.get(`/faculty-attendance/summary?date=${fDate}`);
    setFacultySummary(res.data.statusSummary);
    setFacultyTotal(res.data.total);
  };

  /* ================= MARKS ================= */
  const getMarksReport = async () => {
    if (!mDepartment || !mSemester || !mSubject) {
      return alert("Select Department, Semester & Subject");
    }

    let url = `/marks/report?semester=${mSemester}&subject_id=${mSubject}&department_id=${mDepartment}`;
    if (mSection) url += `&section=${mSection}`;
    if (mDate) url += `&exam_date=${mDate}`;

    const res = await api.get(url);
    const d = res.data;

    setMarksSummary({
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
          <div className="stat-card"><h4>Students</h4><p>{data.students}</p></div>
          <div className="stat-card"><h4>Faculty</h4><p>{data.faculty}</p></div>
          <div className="stat-card"><h4>Departments</h4><p>{data.departments}</p></div>
        </div>

        {/* ================= ATTENDANCE ================= */}
        <div className="section-card">
          <h3>👨‍🎓 Attendance Analytics</h3>

          <div className="filter-group">
            <input type="date" value={sDate} onChange={(e) => setSDate(e.target.value)} />
            <select value={sDepartment} onChange={(e) => setSDepartment(e.target.value)}>
              <option value="">Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select value={sSemester} onChange={(e) => setSSemester(e.target.value)}>
              <option value="">Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
            <select value={sSection} onChange={(e) => setSSection(e.target.value)}>
              <option value="">Section</option>
              <option>A</option><option>B</option>
            </select>
            <button className="primary-btn" onClick={getStudentReport}>Generate</button>
          </div>

          {studentSummary?.overall && (
            <div className="report-grid">
              <div className="report-card present"><h4>Present</h4><p>{studentSummary.overall.present_count}</p></div>
              <div className="report-card absent"><h4>Absent</h4><p>{studentSummary.overall.absent_count}</p></div>
              <div className="report-card total"><h4>Total</h4><p>{studentSummary.overall.total_students}</p></div>
            </div>
          )}

          {studentSummary?.classWise?.length > 0 && (
            <div className="table-card">
              <h4>📘 Class-wise</h4>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Sem</th><th>Sec</th><th>Present</th><th>Absent</th><th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {studentSummary.classWise.map((c,i)=>(
                    <tr key={i}>
                      <td>{c.semester}</td>
                      <td>{c.section}</td>
                      <td className="text-success">{c.present_count}</td>
                      <td className="text-danger">{c.absent_count}</td>
                      <td>{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {studentSummary?.departmentWise?.length > 0 && (
            <div className="table-card">
              <h4>🏫 Department-wise</h4>
              <table className="custom-table">
                <tbody>
                  {studentSummary.departmentWise.map((d,i)=>(
                    <tr key={i}>
                      <td>{d.department_name}</td>
                      <td className="text-success">{d.present_count}</td>
                      <td className="text-danger">{d.absent_count}</td>
                      <td>{d.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ================= FACULTY ================= */}
        <div className="section-card">
          <h3>👨‍🏫 Faculty Attendance</h3>
          <div className="filter-group">
            <input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} />
            <button className="primary-btn" onClick={getFacultyReport}>Generate</button>
          </div>

          <div className="report-grid">
            {facultySummary.map((f,i)=>(
              <div key={i} className="report-card">
                <h4>{f.status}</h4>
                <p>{f.count}</p>
              </div>
            ))}
            <div className="report-card total"><h4>Total</h4><p>{facultyTotal}</p></div>
          </div>
        </div>

        {/* ================= MARKS ================= */}
        <div className="section-card">
          <h3>📘 Marks Analytics</h3>

          <div className="filter-group">
            <select value={mDepartment} onChange={(e)=>setMDepartment(e.target.value)}>
              <option value="">Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>

            <select value={mSemester} onChange={(e)=>setMSemester(e.target.value)}>
              <option value="">Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>

            <select value={mSubject} onChange={(e)=>setMSubject(e.target.value)}>
              <option value="">Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <button className="primary-btn" onClick={getMarksReport}>Generate</button>
          </div>

          {marksSummary && (
            <div className="marks-grid">
              <div className="card stat"><h4>Avg</h4><p>{marksSummary.average}</p></div>
              <div className="card stat"><h4>High</h4><p>{marksSummary.highest}</p></div>
              <div className="card stat"><h4>Low</h4><p>{marksSummary.lowest}</p></div>
              <div className="card pass"><h4>Pass</h4><p>{marksSummary.pass}</p></div>
              <div className="card fail"><h4>Fail</h4><p>{marksSummary.fail}</p></div>
              <div className="card absent"><h4>Absent</h4><p>{marksSummary.absent}</p></div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;