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
    try {
      const res = await api.get("/departments");
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Departments Error:", err);
    }
  };

  const fetchSubjectsByFilter = async (sem, dept) => {
    try {
      const res = await api.get(
        `/subjects/by-semester?semester=${sem}&department_id=${dept}`
      );
      setSubjects(res.data || []);
    } catch (err) {
      console.error("Filtered Subjects Error:", err);
    }
  };

  /* ================= LOAD STUDENTS ================= */

  const fetchStudents = async () => {
    if (!department || !semester) {
      alert("Select Department and Semester");
      return;
    }

    setLoading(true);

    try {
      const res = await api.get(
        `/attendance/filter?department_id=${department}&semester=${semester}`
      );

      const studentList = res.data || [];

      if (studentList.length === 0) {
        alert("No students found");
      }

      setStudents(studentList);

      const initial = studentList.map((s) => ({
        student_id: s.id,
        status: "Present",
      }));

      setAttendance(initial);
    } catch (err) {
      console.error("Fetch Students Error:", err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
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
    if (!subject || !date || !period || attendance.length === 0) {
      alert("Please select subject, date, period and load students");
      return;
    }

    setLoading(true);

    try {
      const data = {
        subject_id: subject,
        date,
        period,
        attendance,
      };

      console.log("Sending Attendance:", data);

      await api.post("/attendance", data);

      alert("✅ Attendance Saved Successfully");

      // RESET
      setStudents([]);
      setAttendance([]);
      setPeriod("");
      setSubject("");
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
        "Error saving attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Layout>
      <div className="attendance-page">
        <h2>Class Attendance</h2>

        {/* FILTERS */}
        <div className="attendance-filters">

          {/* DEPARTMENT */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* SEMESTER */}
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          {/* SUBJECT (DYNAMIC) */}
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!subjects.length}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* PERIOD */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="">Select Period</option>
            {[1,2,3,4,5,6,7,8].map((p) => (
              <option key={p} value={p}>
                Period {p}
              </option>
            ))}
          </select>

          {/* DATE */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* LOAD */}
          <button onClick={fetchStudents} disabled={loading}>
            {loading ? "Loading..." : "Load Students"}
          </button>
        </div>

        {/* TABLE */}
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, index) => (
              <tr key={s.id}>
                <td>{s.name}</td>

                <td>
                  <button
                    className={
                      attendance[index]?.status === "Present"
                        ? "present"
                        : "absent"
                    }
                    onClick={() => toggleStatus(index)}
                  >
                    {attendance[index]?.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* SAVE */}
        <button
          className="save-btn"
          onClick={saveAttendance}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </Layout>
  );
}

export default Attendance;