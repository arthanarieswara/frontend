import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./UserMapping.css";

function UserMapping() {
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [mappings, setMappings] = useState([]);

  const [userId, setUserId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [studentId, setStudentId] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      setLoading(true);

      const [u, f, s, m] = await Promise.all([
        api.get("/auth/users"),
        api.get("/faculty"),
        api.get("/students"),
        api.get("/mapping"),
      ]);

      setUsers(u.data || []);
      setFaculty(f.data || []);
      setStudents(s.data || []);
      setMappings(m.data || []);

    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Error loading data. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!userId) {
      alert("Please select a user");
      return;
    }

    try {
      await api.post("/mapping", {
        user_id: userId,
        faculty_id: facultyId || null,
        student_id: studentId || null,
      });

      alert("Mapping saved successfully");

      setUserId("");
      setFacultyId("");
      setStudentId("");

      fetchData();

    } catch (err) {
      console.error("Error saving mapping:", err);
      alert("Failed to save mapping");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete mapping?")) return;

    try {
      await api.delete(`/mapping/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete mapping");
    }
  };

  return (
    <Layout>
      <div className="mapping-page">

        <h2 className="mapping-title">User Mapping</h2>

        {/* ================= FORM ================= */}
        <div className="mapping-form">

          {/* USER */}
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select User</option>
            {users.length === 0 ? (
              <option disabled>No users found</option>
            ) : (
              users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))
            )}
          </select>

          {/* FACULTY */}
          <select value={facultyId} onChange={(e) => setFacultyId(e.target.value)}>
            <option value="">Select Faculty</option>
            {faculty.length === 0 ? (
              <option disabled>No faculty found</option>
            ) : (
              faculty.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))
            )}
          </select>

          {/* STUDENT */}
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            <option value="">Select Student</option>
            {students.length === 0 ? (
              <option disabled>No students found</option>
            ) : (
              students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))
            )}
          </select>

          <button onClick={handleSubmit}>Map</button>
        </div>

        {/* ================= LOADING ================= */}
        {loading && <p>Loading data...</p>}

        {/* ================= TABLE ================= */}
        <table className="mapping-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Faculty</th>
              <th>Student</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {mappings.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No mappings found
                </td>
              </tr>
            ) : (
              mappings.map((m) => (
                <tr key={m.id}>
                  <td>{m.user_name}</td>
                  <td>{m.email}</td>
                  <td>{m.faculty_name || "-"}</td>
                  <td>{m.student_name || "-"}</td>
                  <td>
                    <button onClick={() => handleDelete(m.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </Layout>
  );
}

export default UserMapping;