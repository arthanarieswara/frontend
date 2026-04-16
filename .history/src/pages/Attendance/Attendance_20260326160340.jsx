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

  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchDepartments();
    fetchSubjects();
  }, []);

  /* ================= FETCH ================= */

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOAD STUDENTS ================= */

  const fetchStudents = async () => {
    if (!department || !semester) {
      alert("Select Department and Semester");
      return;
    }

    try {
      const res = await api.get(
        `/students/filter?department_id=${department}&semester=${semester}`
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
    if (!subject || !date || attendance.length === 0) {
      alert("Please select all fields and load students");
      return;
    }

    try {
      const data = {
        class_id: 1, // 🔥 replace later dynamically
        subject_id: subject,
        faculty_id: 1, // 🔥 replace later
        date,
        attendance,
      };

      console.log("Sending Attendance:", data);

      await api.post("/attendance", data);

      alert("Attendance Saved Successfully");

    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);
      alert("Error saving attendance");
    }
  };

  return (
    <Layout>
      <div className="attendance-page">
        <h2>Class Attendance</h2>

        {/* FILTERS */}
        <div className="attendance-filters">

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

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button onClick={fetchStudents}>Load Students</button>
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

        <button className="save-btn" onClick={saveAttendance}>
          Save Attendance
        </button>
      </div>
    </Layout>
  );
}

export default Attendance;