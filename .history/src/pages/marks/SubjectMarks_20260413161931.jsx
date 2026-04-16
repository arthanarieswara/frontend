import { useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./SubjectMarks.css";

function SubjectMarks() {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [testType, setTestType] = useState("");
  const [testNo, setTestNo] = useState("");

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    let url = `/marks/subject?department_id=${department}&semester=${semester}&subject_id=${subject}&test_type=${testType}&test_no=${testNo}`;
    if (section) url += `&section=${section}`;

    const res = await api.get(url);
    setStudents(res.data);

    // Initialize marks
    const initial = {};
    res.data.forEach((s) => {
      initial[s.student_id] = s.mark || "";
    });
    setMarks(initial);
  };

  /* ================= HANDLE CHANGE ================= */
  const handleMarkChange = (id, value) => {
    setMarks({ ...marks, [id]: value });
  };

  /* ================= SAVE ================= */
  const saveMarks = async () => {
    const payload = students.map((s) => ({
      student_id: s.student_id,
      subject_id: subject,
      semester,
      section,
      test_type: testType,
      test_no: testNo,
      mark: marks[s.student_id] || "AB",
      department_id: department,
    }));

    await api.post("/marks", payload);
    alert("Saved successfully ✅");
  };

  /* ================= ANALYSIS ================= */
  const values = Object.values(marks);

  const total = values.length;
  const absent = values.filter((v) => v === "AB").length;
  const valid = values.filter((v) => v !== "AB");

  const pass = valid.filter((v) => Number(v) >= 50).length;
  const fail = valid.filter((v) => Number(v) < 50).length;

  const avg =
    valid.length > 0
      ? (valid.reduce((a, b) => a + Number(b), 0) / valid.length).toFixed(2)
      : 0;

  const high = valid.length > 0 ? Math.max(...valid) : 0;
  const low = valid.length > 0 ? Math.min(...valid) : 0;

  return (
    <Layout>
      <div className="subject-page">
        <h2>📘 Subject Marks & Analysis</h2>

        {/* ================= FILTERS ================= */}
        <div className="filters modern">
          <select onChange={(e) => setDepartment(e.target.value)}>
            <option>Department</option>
            <option value="1">CSE</option>
          </select>

          <select onChange={(e) => setSemester(e.target.value)}>
            <option>Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Sem {s}
              </option>
            ))}
          </select>

          <select onChange={(e) => setSection(e.target.value)}>
            <option value="">Section</option>
            <option>A</option>
            <option>B</option>
          </select>

          <select onChange={(e) => setSubject(e.target.value)}>
            <option>Subject</option>
          </select>

          <select onChange={(e) => setTestType(e.target.value)}>
            <option>Test Type</option>
            <option>Internal</option>
            <option>Class Test</option>
          </select>

          <select onChange={(e) => setTestNo(e.target.value)}>
            <option>Test No</option>
            <option value="1">Test 1</option>
            <option value="2">Test 2</option>
          </select>

          <button onClick={loadData}>Load</button>
          <button className="export-btn">Export PDF</button>
        </div>

        {/* ================= ANALYSIS ================= */}
        <div className="analysis-grid">
          <div className="card total">Total: {total}</div>
          <div className="card present">Present: {total - absent}</div>
          <div className="card absent">Absent: {absent}</div>
          <div className="card pass">Pass: {pass}</div>
          <div className="card fail">Fail: {fail}</div>
          <div className="card avg">Avg: {avg}</div>
          <div className="card high">High: {high}</div>
          <div className="card low">Low: {low}</div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="table-wrapper">
          <table className="marks-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Mark</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => {
                const value = marks[s.student_id];

                return (
                  <tr key={s.student_id}>
                    <td>{s.roll_number}</td>
                    <td>{s.name}</td>
                    <td>
                      <input
                        type="text"
                        value={value || ""}
                        onChange={(e) =>
                          handleMarkChange(s.student_id, e.target.value)
                        }
                        className={`mark-input ${
                          value === "AB"
                            ? "absent"
                            : value < 50
                              ? "fail"
                              : value
                                ? "pass"
                                : ""
                        }`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button className="save-btn" onClick={saveMarks}>
          Save Marks
        </button>
      </div>
    </Layout>
  );
}

export default SubjectMarks;
