import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Marks.css";

function Marks() {
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");

  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [testType, setTestType] = useState("");
  const [testNo, setTestNo] = useState("");

  const [marks, setMarks] = useState({});

  /* ================= LOAD DEPARTMENTS ================= */
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= AUTO LOAD SUBJECTS ================= */
  useEffect(() => {
    if (semester && department) {
      setSubjects([]); // clear old data
      setSubject("");  // reset selected subject
      fetchSubjects(semester, department);
    } else {
      setSubjects([]);
      setSubject("");
    }
  }, [semester, department]);

  const fetchSubjects = async (sem, dept) => {
    try {
      const res = await api.get(
        `/subjects/by-semester?semester=${sem}&department_id=${dept}`
      );

      console.log("Filtered Subjects:", res.data);

      setSubjects(res.data); // replace (not merge)
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOAD STUDENTS ================= */
  const fetchStudents = async () => {
    if (!semester || !department) {
      return alert("Select semester & department");
    }

    try {
      const res = await api.get(
        `/students/filter-sem-section?semester=${semester}&section=${section}&department_id=${department}`
      );

      const sorted = res.data.sort(
        (a, b) => a.roll_number - b.roll_number
      );

      setStudents(sorted);

      const initial = {};
      sorted.forEach((s) => {
        initial[s.id] = "";
      });

      setMarks(initial);
    } catch (err) {
      console.error(err);
    }
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

    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= REMOVE DUPLICATES ================= */
  const uniqueSubjects = [
    ...new Map(subjects.map((s) => [s.id, s])).values(),
  ];

  return (
    <Layout>
      <div className="marks-container">

        <h2 className="page-title">📘 Marks Entry</h2>

        {/* FILTER CARD */}
        <div className="filter-card">

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
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
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Semester</option>
            {[1,2,3,4,5,6,7,8].map((s) => (
              <option key={s} value={s}>Sem {s}</option>
            ))}
          </select>

          {/* Section */}
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            <option value="">Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="None">None</option>
          </select>

          {/* Subject */}
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!semester || !department}
          >
            <option value="">Subject</option>
            {uniqueSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>

          {/* Test Type */}
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
          >
            <option value="">Test Type</option>
            <option value="Class Test">Class Test</option>
            <option value="Internal">Internal</option>
            <option value="Semester">Semester</option>
          </select>

          {/* Test No */}
          <input
            type="number"
            placeholder="Test No"
            value={testNo}
            onChange={(e) => setTestNo(e.target.value)}
          />

          <button className="primary-btn" onClick={fetchStudents}>
            Load Students
          </button>

        </div>

        {/* TABLE */}
        {students.length > 0 && (
          <div className="table-card">

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
                        className="mark-input"
                        value={marks[s.id] || ""}
                        placeholder="Enter / AB"
                        onChange={(e) =>
                          handleChange(s.id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="save-btn" onClick={saveMarks}>
              💾 Save Marks
            </button>

          </div>
        )}

      </div>
    </Layout>
  );
}

export default Marks;