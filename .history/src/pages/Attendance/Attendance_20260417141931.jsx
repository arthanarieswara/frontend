import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Attendance.css";

function Attendance() {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState(""); // ✅ NEW
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("");

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    fetchDepartments();
  }, []);

  /* ================= SUBJECT FILTER ================= */
  useEffect(() => {
    if (department && semester) {
      fetchSubjectsByFilter(semester, department);
    } else {
      setSubjects([]);
      setSubject("");
    }
  }, [department, semester]);

  /* ================= FETCH ================= */
  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data || []);
  };

  const fetchSubjectsByFilter = async (sem, dept) => {
    const res = await api.get(
      `/subjects/by-semester?semester=${sem}&department_id=${dept}`
    );
    setSubjects(res.data || []);
  };

  /* ================= LOAD STUDENTS ================= */
  const fetchStudents = async () => {
    if (!department || !semester || !section) {
      return alert("Select Department, Semester & Section");
    }

    setLoading(true);

    try {
      const res = await api.get(
        `/attendance/filter?department_id=${department}&semester=${semester}&section=${section}`
      );

      const studentList = res.data || [];
      setStudents(studentList);

      const initial = studentList.map((s) => ({
        student_id: s.id,
        status: "Present",
      }));

      setAttendance(initial);

    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT LOAD ================= */
  const loadExistingAttendance = async () => {
    if (!subject || !date || !period || !section) {
      return alert("Select all filters");
    }

    try {
      const res = await api.get(
        `/attendance/edit?subject_id=${subject}&date=${date}&period=${period}&section=${section}`
      );

      const data = res.data;

      const updated = students.map((s) => {
        const found = data.find((d) => d.student_id === s.id);

        return {
          student_id: s.id,
          status: found ? found.status : "Present",
        };
      });

      setAttendance(updated);

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= TOGGLE ================= */
  const toggleStatus = (index) => {
    const updated = [...attendance];
    updated[index].status =
      updated[index].status === "Present" ? "Absent" : "Present";
    setAttendance(updated);
  };

  /* ================= SAVE ================= */
  const saveAttendance = async () => {
    if (!subject || !date || !period || !section || attendance.length === 0) {
      return alert("Fill all fields");
    }

    setLoading(true);

    try {
      await api.post("/attendance", {
        subject_id: subject,
        date,
        period,
        section, // ✅ NEW
        attendance,
      });

      alert("✅ Attendance Saved Successfully");

    } catch (err) {
      console.error(err);
      alert("Error saving attendance");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Layout>
      <div className="attendance-page">
        <h2>Class Attendance</h2>

        <div className="attendance-filters">

          {/* Department */}
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Semester */}
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="">Semester</option>
            {[1,2,3,4,5,6,7,8].map(s => (
              <option key={s} value={s}>Sem {s}</option>
            ))}
          </select>

          {/* Section ✅ */}
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>

          {/* Subject */}
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Subject</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Period */}
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="">Period</option>
            {[1,2,3,4,5,6,7,8].map(p => (
              <option key={p} value={p}>P{p}</option>
            ))}
          </select>

          {/* Date */}
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <button onClick={fetchStudents}>Load</button>

          {/* ✅ EDIT BUTTON */}
          <button onClick={loadExistingAttendance}>
            Load Existing
          </button>
        </div>

        {/* TABLE */}
        <table className="attendance-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Student Name</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>
                  <button
                    className={
                      attendance[i]?.status === "Present"
                        ? "present"
                        : "absent"
                    }
                    onClick={() => toggleStatus(i)}
                  >
                    {attendance[i]?.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="save-btn" onClick={saveAttendance}>
          Save Attendance
        </button>
      </div>
    </Layout>
  );
}

export default Attendance;