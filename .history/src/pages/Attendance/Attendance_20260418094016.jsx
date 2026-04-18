import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Attendance.css";

function Attendance() {
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("");
  const [wholeDay, setWholeDay] = useState(false);

  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data || []);
  };

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    if (!semester || !department) {
      return alert("Select semester & department");
    }

    try {
      let url = `/students/filter-sem-section?semester=${semester}&department_id=${department}`;

      if (section) {
        url += `&section=${section}`;
      }

      const res = await api.get(url);

      const sorted = res.data.sort(
        (a, b) => a.roll_number - b.roll_number
      );

      setStudents(sorted);

      const initial = {};
      sorted.forEach((s) => {
        initial[s.id] = "Present";
      });

      setAttendance(initial);

    } catch (err) {
      console.error(err);
      alert("Error fetching students");
    }
  };

  /* ================= LOAD EXISTING ================= */
  const loadExistingAttendance = async () => {
    if (!date) {
      return alert("Select date");
    }

    try {
      let url = `/attendance/edit?date=${date}&period=${wholeDay ? 1 : period}`;

      if (section) {
        url += `&section=${section}`;
      }

      const res = await api.get(url);

      const existing = {};
      res.data.forEach((d) => {
        existing[d.student_id] = d.status;
      });

      setAttendance(existing);

    } catch (err) {
      console.error(err);
      alert("Error loading attendance");
    }
  };

  /* ================= TOGGLE ================= */
  const toggleStatus = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === "Present" ? "Absent" : "Present",
    }));
  };

  /* ================= BULK ================= */
  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendance(updated);
  };

  /* ================= SAVE ================= */
  const saveAttendance = async () => {
    if (loading) return;

    if (!date) {
      return alert("Select date");
    }

    if (!wholeDay && !period) {
      return alert("Select period OR whole day");
    }

    const formatted = Object.keys(attendance).map((id) => ({
      student_id: id,
      status: attendance[id],
    }));

    try {
      setLoading(true);

      await api.post("/attendance", {
        date,
        period: wholeDay ? null : period,
        whole_day: wholeDay,
        section: section || null, // ✅ OPTIONAL
        attendance: formatted,
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

        <h2 className="title">📋 Class Attendance</h2>

        <div className="card filters">

          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="">Semester</option>
            {[1,2,3,4,5,6,7,8].map(s => (
              <option key={s} value={s}>Sem {s}</option>
            ))}
          </select>

          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">All Sections</option> {/* ✅ UPDATED */}
            <option value="A">A</option>
            <option value="B">B</option>
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            disabled={wholeDay}
          >
            <option value="">Period</option>
            {[1,2,3,4,5,6,7,8].map(p => (
              <option key={p} value={p}>P{p}</option>
            ))}
          </select>

          <label className="whole-day">
            <input
              type="checkbox"
              checked={wholeDay}
              onChange={(e) => setWholeDay(e.target.checked)}
            />
            Whole Day
          </label>

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <button className="btn primary" onClick={fetchStudents}>
            Load
          </button>

          <button className="btn warning" onClick={loadExistingAttendance}>
            Edit
          </button>
        </div>

        {students.length > 0 && (
          <div className="bulk-actions">
            <button onClick={() => markAll("Present")} className="btn success">
              All Present
            </button>
            <button onClick={() => markAll("Absent")} className="btn danger">
              All Absent
            </button>
          </div>
        )}

        <div className="table-card">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td>{s.roll_number}</td>
                  <td>{s.name}</td>
                  <td>
                    <button
                      className={
                        attendance[s.id] === "Present"
                          ? "status present"
                          : "status absent"
                      }
                      onClick={() => toggleStatus(s.id)}
                    >
                      {attendance[s.id]}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length > 0 && (
          <button
            className="btn save"
            onClick={saveAttendance}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        )}

      </div>
    </Layout>
  );
}

export default Attendance;