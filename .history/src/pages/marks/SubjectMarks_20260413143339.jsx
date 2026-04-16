import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./SubjectMarks.css";

function SubjectMarks() {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [testType, setTestType] = useState("");
  const [testNo, setTestNo] = useState("");

  const [marks, setMarks] = useState({});

  /* ================= LOAD DEPARTMENTS ================= */
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  /* ================= LOAD SUBJECTS ================= */
  useEffect(() => {
    if (department && semester) {
      fetchSubjects();
    }
  }, [department, semester]);

  const fetchSubjects = async () => {
    const res = await api.get(
      `/subjects/by-semester?semester=${semester}&department_id=${department}`
    );
    setSubjects(res.data);
  };

  /* ================= LOAD STUDENTS ================= */
  const loadStudents = async () => {
    if (!department || !semester || !subject || !testType) {
      return alert("Fill all required fields");
    }

    let url = `/marks/subject?semester=${semester}&department_id=${department}&subject_id=${subject}&test_type=${testType}`;

    if (section) url += `&section=${section}`;
    if (testNo) url += `&test_no=${testNo}`;

    const res = await api.get(url);

    setStudents(res.data);

    const initial = {};
    res.data.forEach((s) => {
      initial[s.student_id] = s.mark || "";
    });

    setMarks(initial);
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (id, value) => {
    setMarks({
      ...marks,
      [id]: value,
    });
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
      department_id: department,
      mark: marks[s.student_id] || "AB",
    }));

    await api.post("/marks", payload);

    alert("Marks saved successfully ✅");
  };

  return (
    <Layout>
      <div className="marks-page">

        <h2>📘 Subject Marks Entry</h2>

        {/* ================= FILTERS ================= */}
        <div className="filters">

          <select onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select onChange={(e) => setSemester(e.target.value)}>
            <option value="">Semester</option>
            {[1,2,3,4,5,6,7,8].map((s) => (
              <option key={s} value={s}>Sem {s}</option>
            ))}
          </select>

          <select onChange={(e) => setSection(e.target.value)}>
            <option value="">Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>

          <select onChange={(e) => setSubject(e.target.value)}>
            <option value="">Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select onChange={(e) => setTestType(e.target.value)}>
            <option value="">Test Type</option>
            <option value="Internal">Internal</option>
            <option value="Class Test">Class Test</option>
          </select>

          <select onChange={(e) => setTestNo(e.target.value)}>
            <option value="">Test No</option>
            <option value="1">Test 1</option>
            <option value="2">Test 2</option>
            <option value="3">Test 3</option>
          </select>

          <button onClick={loadStudents}>Load</button>
        </div>

        {/* ================= TABLE ================= */}
        {students.length > 0 && (
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
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <td>{s.roll_number}</td>
                    <td>{s.name}</td>
                    <td>
                      <input
                        value={marks[s.student_id] || ""}
                        onChange={(e) =>
                          handleChange(s.student_id, e.target.value)
                        }
                        placeholder="Mark / AB"
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
        )}

      </div>
    </Layout>
  );
}

export default SubjectMarks;