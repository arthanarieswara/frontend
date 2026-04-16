import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";

function UserMapping() {
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [mappings, setMappings] = useState([]);

  const [userId, setUserId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const u = await api.get("/auth/users");
    const f = await api.get("/faculty");
    const s = await api.get("/students");
    const m = await api.get("/mapping");

    setUsers(u.data);
    setFaculty(f.data);
    setStudents(s.data || []);
    setMappings(m.data);
  };

  const handleSubmit = async () => {
    if (!userId) return alert("Select user");

    await api.post("/mapping", {
      user_id: userId,
      faculty_id: facultyId || null,
      student_id: studentId || null,
    });

    setUserId("");
    setFacultyId("");
    setStudentId("");

    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete mapping?")) return;

    await api.delete(`/mapping/${id}`);
    fetchData();
  };

  return (
    <Layout>
      <h2>User Mapping</h2>

      <div style={{ marginBottom: 20 }}>
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <select value={facultyId} onChange={(e) => setFacultyId(e.target.value)}>
          <option value="">Select Faculty</option>
          {faculty.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <button onClick={handleSubmit}>Map</button>
      </div>

      <table border="1" cellPadding="10">
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
          {mappings.map((m) => (
            <tr key={m.id}>
              <td>{m.user_name}</td>
              <td>{m.email}</td>
              <td>{m.faculty_name || "-"}</td>
              <td>{m.student_name || "-"}</td>
              <td>
                <button onClick={() => handleDelete(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default UserMapping;