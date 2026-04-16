import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Marks.css";

function Marks() {
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [testType, setTestType] = useState("");
  const [testNo, setTestNo] = useState("");

  const [marks, setMarks] = useState({});

  /* ================= LOAD SUBJECTS ================= */
  const fetchSubjects = async (sem, dept) => {
    if (!sem || !dept) return;

    const res = await api.get(
      `/subjects/by-semester?semester=${sem}&department_id=${dept}`,
    );
    setSubjects(res.data);
  };

  /* ================= LOAD STUDENTS ================= */
  const fetchStudents = async () => {
    if (!semester || !department) return alert("Select semester & department");

    const res = await api.get(
      `/students/filter-sem-section?semester=${semester}&section=${section}&department_id=${department}`,
    );

    const sorted = res.data.sort((a, b) => a.roll_number - b.roll_number);

    setStudents(sorted);

    const initial = {};
    sorted.forEach((s) => {
      initial[s.id] = "";
    });

    setMarks(initial);
  };

  /* ================= HANDLE MARK ================= */
  const handleChange = (id, value) => {
    setMarks({
      ...marks,
      [id]: value,
    });
  };

  /* ================= SAVE MARKS ================= */
  const saveMarks = async () => {
    if (!subject || !semester || !testType || !testNo || !department) {
      return alert("Fill all fields");
    }

    const payload = students.map((s) => ({
      student_id: s.id,
      subject_id: subject,
      semester,
      section,
      department_id: department,
      test_type: testType,
      test_no: testNo,
      mark: marks[s.id] || 0,
    }));

    await api.post("/marks", payload);

    alert("Marks saved successfully ✅");
  };

  return (
    <Layout>
      <div className="marks-page">
        <h2>Marks Entry</h2>

        {/* ================= FILTERS ================= */}

        <div className="filters">
          {/* 🔥 NEW: Department */}
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              fetchSubjects(semester, e.target.value);
            }}
          >
            <option value="">Department</option>
            <option value="1">CSE</option>
            <option value="2">ECE</option>
            <option value="3">EEE</option>
          </select>

          <select
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              fetchSubjects(e.target.value, department);
            }}
          >
            <option value="">Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Sem {s}
              </option>
            ))}
          </select>

          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="None">None</option>
          </select>

          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
          >
            <option value="">Test Type</option>
            <option value="Class Test">Class Test</option>
            <option value="Internal">Internal</option>
            <option value="Semester">Semester</option>
          </select>

          <input
            type="number"
            placeholder="Test No"
            value={testNo}
            onChange={(e) => setTestNo(e.target.value)}
          />

          <button onClick={fetchStudents}>Load Students</button>
        </div>

        {/* ================= TABLE ================= */}

        <table className="marks-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Mark</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.roll_number}</td>
                <td>{s.name}</td>
                <td>
                  <input
                    value={marks[s.id] || ""}
                    onChange={(e) => handleChange(s.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="save-btn" onClick={saveMarks}>
          Save Marks
        </button>
      </div>
    </Layout>
  );
}

export default Marks;
