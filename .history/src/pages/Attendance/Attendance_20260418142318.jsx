import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Attendance.css";

function Attendance() {
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [date, setDate] = useState("");

  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState(0);
  /* ================= INIT ================= */
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH STUDENTS (FINAL FIXED) ================= */
  const fetchStudents = async (secParam) => {
    if (!semester || !department) {
      return alert("Select semester & department");
    }

    setStudents([]);
    setAllStudents([]);

    try {
      const finalSection = typeof secParam === "string" ? secParam : section;

      let url = `/students/by-class?department_id=${department}&semester=${semester}`;

      if (finalSection && finalSection.trim() !== "") {
        url += `&section=${finalSection.toUpperCase()}`;
      }

      console.log("FINAL URL:", url);

      const res = await api.get(url);

      console.log("API RESPONSE:", res.data);

      const sorted = res.data.sort((a, b) => a.roll_number - b.roll_number);

      setStudents(sorted);
      setAllStudents(sorted);

      const initial = {};
      sorted.forEach((s) => {
        initial[s.id] = "Present";
      });

      setAttendance(initial);
    } catch (err) {
      console.error(err);
    }
  };
  /* ================= SEARCH ================= */
  const handleSearch = (value) => {
    const filtered = allStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(value.toLowerCase()) ||
        s.roll_number.includes(value),
    );
    setStudents(filtered);
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
    if (!date) return alert("Select date");

    const formatted = Object.keys(attendance).map((id) => ({
      student_id: id,
      status: attendance[id],
    }));

    try {
      setLoading(true);

      await api.post("/attendance", {
        date,
        whole_day: true,
        section: section || null,
        attendance: formatted,
      });

      alert("✅ Attendance Saved");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="attendance-container">
        <h2 className="page-title">📊 Class Attendance</h2>

        {/* FILTER CARD */}
        <div className="filter-card">
          <div className="filter-row">
            {/* DEPARTMENT */}
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setSection("");
                setStudents([]);
              }}
            >
              <option value="">Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* SEMESTER */}
            <select
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setSection("");
                setStudents([]);
              }}
            >
              <option value="">Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Sem {s}
                </option>
              ))}
            </select>

            {/* SECTION TABS */}
            <div className="section-tabs">
              <button
                className={section === "" ? "active" : ""}
                onClick={() => {
                  setSection("");
                  fetchStudents("");
                }}
              >
                All
              </button>

              <button
                className={section === "A" ? "active" : ""}
                onClick={() => {
                  setSection("A");
                  fetchStudents("A");
                }}
              >
                A
              </button>

              <button
                className={section === "B" ? "active" : ""}
                onClick={() => {
                  setSection("B");
                  fetchStudents("B");
                }}
              >
                B
              </button>
            </div>

            {/* DATE */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {/* LOAD BUTTON (FIXED) */}
            <button
              className="btn primary"
              onClick={() => fetchStudents(section)}
            >
              Load
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="🔍 Search student..."
            className="search"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* BULK ACTIONS */}
        {students.length > 0 && (
          <div className="bulk-bar">
            <button className="btn success" onClick={() => markAll("Present")}>
              ✔ All Present
            </button>
            <button className="btn danger" onClick={() => markAll("Absent")}>
              ✖ All Absent
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="premium-table">
            <thead>
              <tr>
                <th>#</th>
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
                          ? "badge present"
                          : "badge absent"
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

        {/* SAVE BUTTON */}
        {students.length > 0 && (
          <button
            className="btn save"
            onClick={saveAttendance}
            disabled={loading}
          >
            {loading ? "Saving..." : "💾 Save Attendance"}
          </button>
        )}
      </div>
    </Layout>
  );
}

export default Attendance;
